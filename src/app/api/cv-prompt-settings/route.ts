import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { DEFAULT_CV_PROMPT_SETTINGS_VI } from "@/types/CvPromptSettings";
import type { CvPromptSettings } from "@/types/CvPromptSettings";

const CACHE_PREFIX = "cv-prompt-settings:";
const DEFAULT_SETTINGS_KEY = `${CACHE_PREFIX}default`;
const ALL_SETTINGS_KEY = `${CACHE_PREFIX}all`;

/**
 * GET /api/cv-prompt-settings
 * Returns all CV prompt settings or default if none exist
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const getDefault = url.searchParams.get("default") === "true";
    const isActive = url.searchParams.get("isActive");

    if (getDefault) {
      // Try to get default from cache, fallback to constant
      let defaultSettings: CvPromptSettings | null = null;
      try {
        defaultSettings = await kv.get<CvPromptSettings>(DEFAULT_SETTINGS_KEY);
      } catch (kvError) {
        console.warn("[CV Prompt Settings] KV not available:", kvError);
      }

      return NextResponse.json({
        data: defaultSettings || DEFAULT_CV_PROMPT_SETTINGS_VI,
        cached: !!defaultSettings,
      });
    }

    // Get all settings
    let allSettings: CvPromptSettings[] = [];
    try {
      const cachedSettings = await kv.get<CvPromptSettings[]>(ALL_SETTINGS_KEY);
      allSettings = cachedSettings || [];
    } catch (kvError) {
      console.warn("[CV Prompt Settings] KV not available:", kvError);
      // Return default if no cache available
      return NextResponse.json({
        data: [DEFAULT_CV_PROMPT_SETTINGS_VI],
        total: 1,
      });
    }

    // Filter by isActive if provided
    if (isActive !== null) {
      const isActiveBoolean = isActive === "true";
      allSettings = allSettings.filter((s) => s.isActive === isActiveBoolean);
    }

    return NextResponse.json({
      data: allSettings,
      total: allSettings.length,
    });
  } catch (err) {
    console.error("Error in GET /api/cv-prompt-settings:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/cv-prompt-settings
 * Create new CV prompt settings
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newSettings: CvPromptSettings = {
      ...body,
      id: `setting-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Get existing settings
    let allSettings: CvPromptSettings[] = [];
    try {
      const cachedSettings = await kv.get<CvPromptSettings[]>(ALL_SETTINGS_KEY);
      allSettings = cachedSettings || [];
    } catch (kvError) {
      console.warn("[CV Prompt Settings] KV not available:", kvError);
      return NextResponse.json(
        { error: "Storage not available" },
        { status: 503 }
      );
    }

    // If this is set as default, unset other defaults
    if (newSettings.isDefault) {
      allSettings = allSettings.map((s) => ({ ...s, isDefault: false }));
      await kv.set(DEFAULT_SETTINGS_KEY, newSettings);
    }

    // Add new settings
    allSettings.push(newSettings);

    // Save to cache
    await kv.set(ALL_SETTINGS_KEY, allSettings);

    return NextResponse.json({
      success: true,
      data: newSettings,
      message: "CV prompt settings created successfully",
    });
  } catch (err) {
    console.error("Error in POST /api/cv-prompt-settings:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PUT /api/cv-prompt-settings
 * Update existing CV prompt settings
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Settings ID is required" },
        { status: 400 }
      );
    }

    // Get existing settings
    let allSettings: CvPromptSettings[] = [];
    try {
      const cachedSettings = await kv.get<CvPromptSettings[]>(ALL_SETTINGS_KEY);
      allSettings = cachedSettings || [];
    } catch (kvError) {
      console.warn("[CV Prompt Settings] KV not available:", kvError);
      return NextResponse.json(
        { error: "Storage not available" },
        { status: 503 }
      );
    }

    const settingIndex = allSettings.findIndex((s) => s.id === id);
    if (settingIndex === -1) {
      return NextResponse.json(
        { error: "Settings not found" },
        { status: 404 }
      );
    }

    // Update settings
    const updatedSettings: CvPromptSettings = {
      ...allSettings[settingIndex],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    allSettings[settingIndex] = updatedSettings;

    // If this is set as default, unset other defaults
    if (updatedSettings.isDefault) {
      allSettings = allSettings.map((s) =>
        s.id === id ? s : { ...s, isDefault: false }
      );
      await kv.set(DEFAULT_SETTINGS_KEY, updatedSettings);
    }

    // Save to cache
    await kv.set(ALL_SETTINGS_KEY, allSettings);

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: "CV prompt settings updated successfully",
    });
  } catch (err) {
    console.error("Error in PUT /api/cv-prompt-settings:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/cv-prompt-settings?id=<id>
 * Delete CV prompt settings
 */
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Settings ID is required" },
        { status: 400 }
      );
    }

    // Get existing settings
    let allSettings: CvPromptSettings[] = [];
    try {
      const cachedSettings = await kv.get<CvPromptSettings[]>(ALL_SETTINGS_KEY);
      allSettings = cachedSettings || [];
    } catch (kvError) {
      console.warn("[CV Prompt Settings] KV not available:", kvError);
      return NextResponse.json(
        { error: "Storage not available" },
        { status: 503 }
      );
    }

    const filteredSettings = allSettings.filter((s) => s.id !== id);

    if (filteredSettings.length === allSettings.length) {
      return NextResponse.json(
        { error: "Settings not found" },
        { status: 404 }
      );
    }

    // Save to cache
    await kv.set(ALL_SETTINGS_KEY, filteredSettings);

    // If deleted was default, set first remaining as default
    const deletedSetting = allSettings.find((s) => s.id === id);
    if (deletedSetting?.isDefault && filteredSettings.length > 0) {
      filteredSettings[0].isDefault = true;
      await kv.set(DEFAULT_SETTINGS_KEY, filteredSettings[0]);
      await kv.set(ALL_SETTINGS_KEY, filteredSettings);
    }

    return NextResponse.json({
      success: true,
      message: "CV prompt settings deleted successfully",
    });
  } catch (err) {
    console.error("Error in DELETE /api/cv-prompt-settings:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

