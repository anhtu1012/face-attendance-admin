import { Button } from "antd";

interface SmallGoogleMapProps {
  mapUrl: string;
  currentLat: string;
  currentLong: string;
}

const SmallGoogleMap: React.FC<SmallGoogleMapProps> = ({
  mapUrl,
  currentLat,
  currentLong,
}) => {
  return (
    <div className="small-google-map" style={{ width: "100%", height: "100%" }}>
      {currentLat && currentLong ? (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{
              border: "none",
              borderRadius: "8px",
              minHeight: "120px",
              display: "block",
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Company Location Small"
            onLoad={() => console.log("Map iframe loaded successfully")}
            onError={() => console.log("Map iframe failed to load")}
          />

          <Button
            type="link"
            size="small"
            onClick={() =>
              window.open(
                `https://maps.google.com/maps?q=${currentLat},${currentLong}&hl=vi&z=16`,
                "_blank"
              )
            }
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              background: "rgba(255, 255, 255, 0.9)",
              color: "rgb(21, 101, 192)",
              fontSize: "10px",
              padding: "2px 6px",
              height: "auto",
              borderRadius: "4px",
              zIndex: 10,
              fontWeight: "600",
            }}
          >
            Mở rộng
          </Button>
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            minHeight: "120px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
            color: "rgb(21, 101, 192)",
            fontSize: "14px",
            fontWeight: "600",
            borderRadius: "8px",
            border: "2px solid #42a5f5",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>🗺️</div>
            <div>Chọn địa chỉ để hiển thị bản đồ</div>
            {mapUrl && (
              <div style={{ fontSize: "10px", marginTop: "4px", opacity: 0.7 }}>
                URL: {mapUrl.substring(0, 50)}...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmallGoogleMap;
