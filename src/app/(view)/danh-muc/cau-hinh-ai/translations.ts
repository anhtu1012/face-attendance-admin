// Bilingual labels for CV Prompt Settings
export const translations = {
  // Page title and actions
  pageTitle: {
    vi: "Quản lý Cấu hình Prompt Phân tích CV",
    en: "CV Analysis Prompt Settings Management",
  },
  createButton: {
    vi: "Tạo cấu hình mới",
    en: "Create new configuration",
  },
  editTitle: {
    vi: "Chỉnh sửa cấu hình",
    en: "Edit configuration",
  },
  createTitle: {
    vi: "Tạo cấu hình mới",
    en: "Create new configuration",
  },
  saveButton: {
    vi: "Lưu",
    en: "Save",
  },
  cancelButton: {
    vi: "Hủy",
    en: "Cancel",
  },

  // Table columns
  columns: {
    name: {
      vi: "Tên cấu hình",
      en: "Configuration name",
    },
    description: {
      vi: "Mô tả",
      en: "Description",
    },
    status: {
      vi: "Trạng thái",
      en: "Status",
    },
    weights: {
      vi: "Tỷ trọng",
      en: "Weights",
    },
    actions: {
      vi: "Thao tác",
      en: "Actions",
    },
  },

  // Status labels
  status: {
    default: {
      vi: "Mặc định",
      en: "Default",
    },
    active: {
      vi: "Hoạt động",
      en: "Active",
    },
    inactive: {
      vi: "Tắt",
      en: "Inactive",
    },
  },

  // Weight labels
  weights: {
    technicalSkills: {
      vi: "Kỹ năng",
      en: "Technical skills",
    },
    experience: {
      vi: "Kinh nghiệm",
      en: "Experience",
    },
    seniority: {
      vi: "Seniority",
      en: "Seniority",
    },
  },

  // Action buttons
  actions: {
    setDefault: {
      vi: "Mặc định",
      en: "Set default",
    },
    edit: {
      vi: "Sửa",
      en: "Edit",
    },
    delete: {
      vi: "Xóa",
      en: "Delete",
    },
    confirmDelete: {
      vi: "Xác nhận xóa?",
      en: "Confirm deletion?",
    },
    deleteDescription: {
      vi: "Bạn có chắc muốn xóa cấu hình này?",
      en: "Are you sure you want to delete this configuration?",
    },
  },

  // Tab labels
  tabs: {
    basicInfo: {
      vi: "Thông tin cơ bản",
      en: "Basic Information",
    },
    matchScoreWeights: {
      vi: "Tỷ trọng MatchScore",
      en: "MatchScore Weights",
    },
    recommendationThresholds: {
      vi: "Ngưỡng Recommendation",
      en: "Recommendation Thresholds",
    },
    analysisInstruction: {
      vi: "Hướng dẫn phân tích",
      en: "Analysis Instructions",
    },
    languageConfig: {
      vi: "Cấu hình ngôn ngữ",
      en: "Language Configuration",
    },
  },

  // Form labels
  form: {
    // Basic info tab
    name: {
      vi: "Tên cấu hình",
      en: "Configuration name",
    },
    description: {
      vi: "Mô tả",
      en: "Description",
    },
    isActive: {
      vi: "Kích hoạt",
      en: "Active",
    },
    isDefault: {
      vi: "Mặc định",
      en: "Default",
    },
    yes: {
      vi: "Có",
      en: "Yes",
    },
    no: {
      vi: "Không",
      en: "No",
    },

    // Match score weights tab
    technicalSkills: {
      vi: "Kỹ năng kỹ thuật (%)",
      en: "Technical skills (%)",
    },
    experience: {
      vi: "Kinh nghiệm (%)",
      en: "Experience (%)",
    },
    seniority: {
      vi: "Seniority (%)",
      en: "Seniority (%)",
    },

    // Recommendation thresholds
    stronglyRecommend: {
      vi: "Strongly Recommend",
      en: "Strongly Recommend",
    },
    recommend: {
      vi: "Recommend",
      en: "Recommend",
    },
    consider: {
      vi: "Consider",
      en: "Consider",
    },
    notGoodFit: {
      vi: "Not a good fit",
      en: "Not a good fit",
    },
    min: {
      vi: "Min (%)",
      en: "Min (%)",
    },
    max: {
      vi: "Max (%)",
      en: "Max (%)",
    },
    label: {
      vi: "Label",
      en: "Label",
    },

    // Analysis instructions tab
    summarySentencesCount: {
      vi: "Số câu tóm tắt",
      en: "Summary sentences count",
    },
    maxStrengthsCount: {
      vi: "Số điểm mạnh tối đa",
      en: "Maximum strengths count",
    },
    maxWeaknessesCount: {
      vi: "Số điểm yếu tối đa",
      en: "Maximum weaknesses count",
    },
    summaryGuidelines: {
      vi: "Hướng dẫn tóm tắt (mỗi dòng là 1 hướng dẫn)",
      en: "Summary guidelines (one guideline per line)",
    },
    strengthsGuidelines: {
      vi: "Hướng dẫn điểm mạnh",
      en: "Strengths guidelines",
    },
    weaknessesGuidelines: {
      vi: "Hướng dẫn điểm yếu",
      en: "Weaknesses guidelines",
    },
    generalRules: {
      vi: "Quy tắc chung",
      en: "General rules",
    },

    // Language config tab
    vietnamese: {
      vi: "Tiếng Việt",
      en: "Vietnamese",
    },
    english: {
      vi: "English",
      en: "English",
    },
    roleDescription: {
      vi: "Mô tả vai trò",
      en: "Role description",
    },
    analysisTitle: {
      vi: "Tiêu đề phân tích",
      en: "Analysis title",
    },
    rulesTitle: {
      vi: "Tiêu đề quy tắc",
      en: "Rules title",
    },
  },

  // Placeholders
  placeholders: {
    name: {
      vi: "VD: Cấu hình cho vị trí Developer",
      en: "E.g.: Configuration for Developer position",
    },
    description: {
      vi: "Mô tả về cấu hình này...",
      en: "Description about this configuration...",
    },
    guidelines: {
      vi: "Nhập mỗi hướng dẫn trên 1 dòng",
      en: "Enter one guideline per line",
    },
    rules: {
      vi: "Nhập mỗi quy tắc trên 1 dòng",
      en: "Enter one rule per line",
    },
  },

  // Messages
  messages: {
    loadError: {
      vi: "Không thể tải cấu hình",
      en: "Could not load configurations",
    },
    updateSuccess: {
      vi: "Cập nhật cấu hình thành công",
      en: "Configuration updated successfully",
    },
    createSuccess: {
      vi: "Tạo cấu hình mới thành công",
      en: "New configuration created successfully",
    },
    saveError: {
      vi: "Lỗi khi lưu cấu hình",
      en: "Error saving configuration",
    },
    deleteSuccess: {
      vi: "Xóa cấu hình thành công",
      en: "Configuration deleted successfully",
    },
    deleteError: {
      vi: "Lỗi khi xóa cấu hình",
      en: "Error deleting configuration",
    },
    setDefaultSuccess: {
      vi: "Đã đặt làm cấu hình mặc định",
      en: "Set as default configuration successfully",
    },
    setDefaultError: {
      vi: "Lỗi khi đặt mặc định",
      en: "Error setting default configuration",
    },
    toggleActiveSuccess: {
      vi: (isActive: boolean) =>
        `Đã ${isActive ? "kích hoạt" : "vô hiệu hóa"} cấu hình`,
      en: (isActive: boolean) =>
        `Configuration ${isActive ? "activated" : "deactivated"} successfully`,
    },
    toggleActiveError: {
      vi: "Lỗi khi thay đổi trạng thái",
      en: "Error changing status",
    },
    nameRequired: {
      vi: "Vui lòng nhập tên",
      en: "Please enter a name",
    },
    weightRequired: {
      vi: "Vui lòng nhập tỷ trọng",
      en: "Please enter a weight value",
    },
  },
};
