import { Button, Card } from "antd";

interface GoogleMapsCardProps {
  mapUrl: string;
  currentLat: string;
  currentLong: string;
}

const GoogleMapsCard: React.FC<GoogleMapsCardProps> = ({
  mapUrl,
  currentLat,
  currentLong,
}) => {
  return (
    <Card
      title="Vị trí trên bản đồ"
      className="google-maps-card"
      extra={
        currentLat && currentLong ? (
          <Button
            type="link"
            onClick={() =>
              window.open(
                `https://maps.google.com/maps?q=${currentLat},${currentLong}&hl=vi&z=16`,
                "_blank"
              )
            }
            style={{ color: "white" }}
          >
            Mở trong Google Maps
          </Button>
        ) : null
      }
    >
      {mapUrl ? (
        <iframe
          className="maps-iframe"
          src={mapUrl}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Company Location"
        />
      ) : (
        <div className="maps-placeholder">
          <div>
            <div style={{ fontSize: "24px", marginBottom: "12px" }}>🗺️</div>
            <div style={{ fontSize: "16px", fontWeight: "500" }}>
              Chọn địa chỉ để hiển thị bản đồ
            </div>
            <div style={{ fontSize: "14px", marginTop: "8px", opacity: 0.7 }}>
              Bản đồ sẽ hiển thị vị trí công ty sau khi chọn địa chỉ
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default GoogleMapsCard;
