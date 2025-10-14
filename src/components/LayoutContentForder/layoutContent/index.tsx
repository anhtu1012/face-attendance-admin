import React from "react";
import CloseOpenModal from "../closeOpenModal";
import "./index.scss";
import { Card } from "antd";

type sizeArray = [number, number];

type LayoutContentProps = {
  layoutType: number;
  content1: React.ReactNode; // Content for the left section
  content2?: React.ReactNode; // Content for the right section
  content3?: React.ReactNode; // Content for the bottom section
  content4?: React.ReactNode; // Content for the bottest section
  content5?: React.ReactNode; // Content for the bottest section
  option?: {
    sizeAdjust?: sizeArray; // Optional size adjustment
    floatButton?: boolean; // Optional full size adjustment
    hideContent?: number; // Optional flag to hide content
    cardTitle?: string; // Optional title for card layout
  };
};

function LayoutContent({
  layoutType,
  content1,
  content2,
  content3,
  content4,
  content5,
  option,
}: LayoutContentProps) {
  let defaultLeft = 1.8;
  let defaultRight = 8.2;
  //layout đơn
  if (layoutType === 1) {
    return (
      <section
        className="content1"
        style={{
          width: "auto",
          height: "85vh",
          overflow: "auto",
          backgroundColor: "#fff",
          padding: "12px",
          borderRadius: "10px",
        }}
      >
        {content1}
      </section>
    );
    //layout trái phải
  } else if (layoutType === 2) {
    defaultLeft = 6.5;
    defaultRight = 3.5;
    if (option?.sizeAdjust) {
      defaultLeft = option.sizeAdjust[0];
      defaultRight = option.sizeAdjust[1];
    }
    return (
      <CloseOpenModal
        layoutType={2}
        floatButton={option?.floatButton}
        hideContent={option?.hideContent}
      >
        <section
          style={{
            display: "flex",
            gap: "12px",
            backgroundColor: "transparent",
            borderRadius: "10px",
          }}
        >
          <section
            className="content1"
            style={{
              flex: defaultLeft,
              padding: "12px",
              width: "65%",
              height: "auto",
              backgroundColor: "#fff",
              borderRadius: "10px",
            }}
          >
            {content1} {/* Left content */}
          </section>
          <section
            className="content2"
            style={{
              flex: defaultRight,
              width: "35%",
              height: "fit-content",
              padding: "12px",
              backgroundColor: "#fff",
              borderRadius: "10px",
            }}
          >
            {content2} {/* Right content */}
          </section>
        </section>
      </CloseOpenModal>
    );
    //layout trên dưới
  } else if (layoutType === 3) {
    return (
      <CloseOpenModal
        layoutType={3}
        floatButton={option?.floatButton}
        hideContent={option?.hideContent}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "10px",
            // Use margin on content2 instead of gap so we can collapse space when content1 is hidden
            gap: "0px",
          }}
        >
          <div
            className="content1"
            style={{
              flex: 2,
              backgroundColor: "#fff",
              height: "auto",
              padding: "12px",
              borderRadius: "10px",
            }}
          >
            <div className="feature">{/* Thêm xóa lưu ở đây */}</div>
            {content1}
          </div>
          <div
            className="content2"
            style={{
              flex: 8,
              backgroundColor: "#fff",
              padding: "12px",
              borderRadius: "10px",
              marginTop: "12px",
            }}
          >
            {content2}
          </div>
        </div>
      </CloseOpenModal>
    );
  } else if (layoutType === 4) {
    return (
      <CloseOpenModal
        layoutType={4}
        floatButton={option?.floatButton}
        hideContent={option?.hideContent}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "10px",
            gap: "12px",
          }}
        >
          <div
            className={`content1 ${
              option?.hideContent === 1 ? "hideContent" : ""
            }`}
            style={{
              flex: 7,
              backgroundColor: "#fff",
              height: "auto",
              padding: "12px",
              borderRadius: "10px",
            }}
          >
            {content1}
          </div>
          <div
            className={`content2 ${
              option?.hideContent === 2 ? "hideContent" : ""
            }`}
            style={{
              flex: 3,
              backgroundColor: "#fff",
              height: "auto",
              padding: "12px",
              borderRadius: "10px",
            }}
          >
            <div className="feature">{/* Thêm xóa lưu ở đây */}</div>
            {content2}
          </div>
        </div>
      </CloseOpenModal>
    );
  } else if (layoutType === 5) {
    if (option?.sizeAdjust) {
      defaultLeft = option.sizeAdjust[0];
      defaultRight = option.sizeAdjust[1];
    }
    return (
      <CloseOpenModal
        layoutType={5}
        floatButton={option?.floatButton}
        hideContent={option?.hideContent}
      >
        <div
          style={{
            display: "flex",
            borderRadius: "10px",
            gap: "12px",
          }}
        >
          <div className="content1" style={{ flex: defaultLeft }}>
            <Card
              className="card-layout"
              title={option?.cardTitle}
              styles={{
                header: {
                  background:
                    "linear-gradient(to right, rgb(13, 71, 161), rgb(30, 136, 229))",
                  textAlign: "center",
                  textTransform: "uppercase",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "white",
                },
              }}
              style={{
                // backgroundColor: "#fff",
                height: "calc(100vh - 106px)",
                borderRadius: "10px",
                overflowY: "auto",
                position: "relative",
              }}
            >
              {content1}
            </Card>
          </div>
          <div
            className="content2"
            style={{
              flex: defaultRight,
              backgroundColor: "#fff",
              height: "calc(100vh - 106px)",
              padding: "12px",
              borderRadius: "10px",
              overflowY: "auto",
            }}
          >
            <div className="feature">{/* Thêm xóa lưu ở đây */}</div>
            {content2}
          </div>
        </div>
      </CloseOpenModal>
    );
  } else if (layoutType === 6) {
    return (
      <CloseOpenModal
        layoutType={6}
        floatButton={option?.floatButton}
        hideContent={option?.hideContent}
      >
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            backgroundColor: "transparent",
            borderRadius: "10px",
          }}
        >
          {/* Flex container for content1 and content2 */}
          <section
            style={{
              display: "flex",
            }}
          >
            <section
              className={`content1 ${
                option?.hideContent === 1 ? "hideContent" : ""
              }`}
              style={{
                flex: 6.5,
                padding: "12px",
                width: "65%",
                height: "75vh",
                marginRight: "12px",
                backgroundColor: "#fff",
                borderRadius: "10px",
                overflowY: "auto",
                display: option?.hideContent === 1 ? "none" : "block",
              }}
            >
              {content1} {/* Left content */}
            </section>
            <section
              className={`content2 ${
                option?.hideContent === 2 ? "hideContent" : ""
              }`}
              style={{
                flex: 3.5,
                width: "35%",
                height: "75vh",
                padding: "12px",
                backgroundColor: "#fff",
                borderRadius: "10px",
                overflowY: "auto",
              }}
            >
              {content2} {/* Right content */}
            </section>
          </section>

          {/* Bottom section for content3 */}
          <section
            className={`content3 ${
              option?.hideContent === 3 ? "hideContent" : ""
            }`}
            style={{
              width: "auto",
              height: "auto",
              backgroundColor: "#fff",
              padding: "12px",
              borderRadius: "10px",
            }}
          >
            {content3} {/* Bottom content */}
          </section>
          <section
            className={`content4 ${
              option?.hideContent === 4 ? "hideContent" : ""
            }`}
            style={{
              width: "auto",
              height: "auto",
              backgroundColor: "#fff",
              padding: "12px",
              borderRadius: "10px",
            }}
          >
            {content4} {/* Bottom content */}
          </section>
        </section>
      </CloseOpenModal>
    );
  } else if (layoutType === 7) {
    return (
      <CloseOpenModal
        layoutType={7}
        floatButton={option?.floatButton}
        hideContent={option?.hideContent}
      >
        <section
          style={{
            display: "flex",
            gap: "12px",
            backgroundColor: "transparent",
            borderRadius: "10px",
            height: "calc(100vh - 106px)",
            overflow: "hidden",
          }}
        >
          <section
            style={{
              flex: 7,
              width: "70%",
              borderRadius: "10px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              minHeight: 0,
            }}
          >
            <section
              className="content1"
              style={{
                width: "100%",
                backgroundColor: "#fff",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #e0e0e0",
                height: "calc(50% + 8px)",
                overflow: "hidden",
              }}
            >
              {content1}
            </section>
            <section
              className="content2"
              style={{
                width: "100%",
                backgroundColor: "#fff",
                padding: "12px",
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                height: "calc((100% - 12px) / 4)",
                overflow: "hidden",
              }}
            >
              {content2}
            </section>
            <section
              className="content3"
              style={{
                width: "100%",
                backgroundColor: "#fff",
                padding: "12px",
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                height: "calc((100% - 12px) / 4)",
                overflow: "hidden",
              }}
            >
              {content3}
            </section>
          </section>
          <section
            style={{
              flex: 3,
              width: "30%",
              height: "100%",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              minHeight: 0,
            }}
          >
            <section
              style={{
                borderRadius: "10px",
                border: "1px solid #e0e0e0",
                backgroundColor: "#fff",
                overflow: "hidden",
                height: "calc((100% - 12px) / 2)",
              }}
              className="content4"
            >
              {content4}
            </section>
            <section
              style={{
                border: "1px solid #e0e0e0",
                backgroundColor: "#fff",
                borderRadius: "10px",
                overflow: "hidden",
                height: "calc((100% - 12px) / 2)",
              }}
              className="content5"
            >
              {content5}
            </section>
          </section>
        </section>
      </CloseOpenModal>
    );
  } else if (layoutType === 8) {
    return (
      <CloseOpenModal
        layoutType={8}
        floatButton={option?.floatButton}
        hideContent={option?.hideContent}
      >
        <section>
          <section
            className={`content1 ${
              option?.hideContent === 1 ? "hideContent" : ""
            }`}
            style={{
              width: "100%",
              backgroundColor: "#fff",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "10px",
              border: "1px solid #e0e0e0",
            }}
          >
            {content1}
          </section>
          <section
            style={{
              display: "flex",
              gap: "12px",
              backgroundColor: "transparent",
              borderRadius: "10px",
            }}
          >
            <section
              style={{
                flex: 7,
                width: "70%",
                borderRadius: "10px",
              }}
            >
              <section
                className={`content2 ${
                  option?.hideContent === 2 ? "hideContent" : ""
                }`}
                style={{
                  width: "100%",
                  backgroundColor: "#fff",
                  padding: "12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                }}
              >
                {content2}
              </section>
              <section
                className={`content3 ${
                  option?.hideContent === 3 ? "hideContent" : ""
                }`}
                style={{
                  width: "100%",
                  backgroundColor: "#fff",
                  padding: "12px",
                  marginTop: "12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                }}
              >
                {content3}
              </section>
            </section>

            <section
              className={`content4 ${
                option?.hideContent === 4 ? "hideContent" : ""
              }`}
              style={{
                flex: 3,
                width: "30%",
                height: "fit-content",
                padding: "12px",
                border: "1px solid #e0e0e0",
                backgroundColor: "#fff",
                borderRadius: "10px",
              }}
            >
              {content4}
            </section>
          </section>
        </section>
      </CloseOpenModal>
    );
  } else if (layoutType === 9) {
    return (
      <CloseOpenModal
        layoutType={9}
        floatButton={option?.floatButton}
        hideContent={option?.hideContent}
      >
        <section
          style={{
            width: "100vw",
            height: "calc(100vh - 180px)",
            display: "flex",
            paddingRight: "2vh",
            paddingTop: "1vh",
            flexDirection: "column",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <section
            className={`content1 ${
              option?.hideContent === 1 ? "hideContent" : ""
            }`}
            style={{
              width: "100%",
              backgroundColor: "#fff",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "10px",
              border: "1px solid rgba(25, 118, 210, 0.2)",
              boxShadow: "0 0 1px 1px rgba(25, 118, 210, 0.4)",
            }}
          >
            {content1}
          </section>
          <section
            style={{
              display: "flex",
              gap: "12px",
              backgroundColor: "transparent",
              borderRadius: "10px",
            }}
          >
            <section
              style={{
                flex: 7,
                width: "70%",
                borderRadius: "10px",
              }}
            >
              <section
                className={`content2 ${
                  option?.hideContent === 2 ? "hideContent" : ""
                }`}
                style={{
                  width: "100%",
                  backgroundColor: "#fff",
                  padding: "12px",
                  border: "1px solid rgba(25, 118, 210, 0.2)",
                  boxShadow: "0 0 1px 1px rgba(25, 118, 210, 0.4)",
                  borderRadius: "10px",
                }}
              >
                {content2}
              </section>
              <section
                className={`content3 ${
                  option?.hideContent === 3 ? "hideContent" : ""
                }`}
                style={{
                  width: "100%",
                  backgroundColor: "#fff",
                  padding: "12px",
                  marginTop: "12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                }}
              >
                {content3}
              </section>
            </section>
          </section>
        </section>
      </CloseOpenModal>
    );
  } else if (layoutType === 10) {
    return (
      <CloseOpenModal
        layoutType={10}
        floatButton={option?.floatButton}
        hideContent={option?.hideContent}
      >
        <section>
          <section
            className={`content1 ${
              option?.hideContent === 1 ? "hideContent" : ""
            }`}
            style={{
              width: "100%",
              backgroundColor: "#fff",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "10px",
              border: "1px solid #e0e0e0",
            }}
          >
            {content1}
          </section>
          <section
            style={{
              display: "flex",
              gap: "12px",
              backgroundColor: "transparent",
              borderRadius: "10px",
            }}
          >
            <section
              style={{
                width: "100%",
                display: "flex",
                gap: 12,
                borderRadius: "10px",
              }}
            >
              <section
                className={`content2 ${
                  option?.hideContent === 2 ? "hideContent" : ""
                }`}
                style={{
                  flex: 2,
                  width: "20%",
                  backgroundColor: "#fff",
                  height: "78.5vh",
                  overflow: "auto",
                  padding: "12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                }}
              >
                {content2}
              </section>
              <section
                className={`content3 ${
                  option?.hideContent === 3 ? "hideContent" : ""
                }`}
                style={{
                  backgroundColor: "#fff",
                  padding: "12px",
                  flex: 8,
                  width: "80%",
                  height: "78.5vh",
                  overflow: "auto",
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                }}
              >
                {content3}
              </section>
            </section>
          </section>
          {content4 && option?.hideContent !== 4 && (
            <section
              className={`content4 ${
                option?.hideContent === 4 ? "hideContent" : ""
              }`}
              style={{
                backgroundColor: "#fff",
                padding: "12px",
                marginTop: 12,
                width: "100%",
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
              }}
            >
              {content4}
            </section>
          )}
        </section>
      </CloseOpenModal>
    );
  } else if (layoutType === 11) {
    return (
      <CloseOpenModal
        layoutType={11}
        floatButton={option?.floatButton}
        hideContent={option?.hideContent}
      >
        <section>
          <section
            className="content1"
            style={{
              width: "100%",
              backgroundColor: "#fff",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "10px",
              border: "1px solid #e0e0e0",
            }}
          >
            {content1}
          </section>
          <section
            style={{
              display: "flex",
              gap: "12px",
              backgroundColor: "transparent",
              borderRadius: "10px",
            }}
          >
            <section
              style={{
                width: "100%",
                display: "flex",
                gap: 12,
                borderRadius: "10px",
              }}
            >
              <section
                className="content2"
                style={{
                  flex: 6.5,
                  width: "20%",
                  backgroundColor: "#fff",
                  padding: "12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                }}
              >
                {content2}
              </section>
              <section
                className="content3"
                style={{
                  backgroundColor: "#fff",
                  padding: "12px",
                  flex: 3.5,
                  width: "80%",
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                }}
              >
                {content3}
              </section>
            </section>
          </section>
        </section>
      </CloseOpenModal>
    );
  } else if (layoutType === 12) {
    return (
      <CloseOpenModal
        layoutType={12}
        floatButton={option?.floatButton}
        hideContent={option?.hideContent}
      >
        <section>
          <section
            className="content1"
            style={{
              width: "100%",
              backgroundColor: "#fff",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "10px",
              border: "1px solid #e0e0e0",
            }}
          >
            {content1}
          </section>
          <section
            style={{
              display: "flex",
              gap: "12px",
              backgroundColor: "transparent",
              borderRadius: "10px",
            }}
          >
            <section
              style={{
                width: "100%",
                display: "flex",
                gap: 12,
                borderRadius: "10px",
              }}
            >
              <section
                className="content2"
                style={{
                  flex: 5,
                  width: "20%",
                  backgroundColor: "#fff",
                  padding: "12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                }}
              >
                {content2}
              </section>
              <section
                className="content3"
                style={{
                  backgroundColor: "#fff",
                  padding: "12px",
                  flex: 5,
                  width: "80%",
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                }}
              >
                {content3}
              </section>
            </section>
          </section>
        </section>
      </CloseOpenModal>
    );
  } else if (layoutType === 13) {
    let defaultLeft = 3;
    let defaultRight = 7;
    if (option?.sizeAdjust) {
      defaultLeft = option.sizeAdjust[0];
      defaultRight = option.sizeAdjust[1];
    }
    return (
      <CloseOpenModal
        layoutType={13}
        floatButton={option?.floatButton}
        hideContent={option?.hideContent}
      >
        <section>
          <section
            className="content1"
            style={{
              width: "100%",
              backgroundColor: "#fff",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "10px",
              border: "1px solid #e0e0e0",
            }}
          >
            {content1}
          </section>
          <section
            style={{
              display: "flex",
              gap: "12px",
              backgroundColor: "transparent",
              borderRadius: "10px",
            }}
          >
            <section
              style={{
                width: "100%",
                display: "flex",
                gap: 12,
                borderRadius: "10px",
              }}
            >
              <section
                className="content2"
                style={{
                  flex: defaultLeft,
                  width: "30%",
                  backgroundColor: "#fff",
                  padding: "12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                }}
              >
                {content2}
              </section>
              <section
                className="content3"
                style={{
                  backgroundColor: "#fff",
                  padding: "12px",
                  flex: defaultRight,
                  width: "70%",
                  height: "78.5vh",
                  overflow: "auto",
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                }}
              >
                {content3}
              </section>
            </section>
          </section>
          {content4 && (
            <section
              className="content4"
              style={{
                backgroundColor: "#fff",
                padding: "12px",
                marginTop: 12,
                width: "100%",
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
              }}
            >
              {content4}
            </section>
          )}
        </section>
      </CloseOpenModal>
    );
  } else if (layoutType === 14) {
    return (
      <CloseOpenModal
        layoutType={14}
        floatButton={option?.floatButton}
        hideContent={option?.hideContent}
      >
        <section>
          <section
            className="content1"
            style={{
              width: "100%",
              backgroundColor: "#fff",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "10px",
              border: "1px solid #e0e0e0",
            }}
          >
            {content1}
          </section>
          <section
            style={{
              display: "flex",
              gap: "12px",
              backgroundColor: "transparent",
              borderRadius: "10px",
            }}
          >
            <section
              style={{
                width: "100%",
                display: "flex",
                gap: 12,
                borderRadius: "10px",
              }}
            >
              <section
                className="content2"
                style={{
                  flex: 3,
                  width: "30%",
                  backgroundColor: "#fff",
                  padding: "12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                }}
              >
                {content2}
              </section>
              <section
                className="content3"
                style={{
                  backgroundColor: "#fff",
                  padding: "12px",
                  flex: 3,
                  width: "70%",
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                }}
              >
                {content3}
              </section>

              <section
                className="content4"
                style={{
                  flex: 3,
                  width: "30%",
                  backgroundColor: "#fff",
                  padding: "12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                }}
              >
                {content4}
              </section>
            </section>
          </section>
        </section>
      </CloseOpenModal>
    );
  } else if (layoutType === 15) {
    return (
      <CloseOpenModal
        layoutType={15}
        floatButton={option?.floatButton}
        hideContent={option?.hideContent}
      >
        <section>
          <section
            className="content1"
            style={{
              width: "100%",
              backgroundColor: "#fff",
              marginBottom: "12px",
              borderRadius: "10px",
              padding: "8px",
            }}
          >
            {content1}
          </section>
          <section
            style={{
              display: "flex",
              gap: "12px",
              backgroundColor: "transparent",
              borderRadius: "10px",
            }}
          >
            <section
              style={{
                width: "100%",
                display: "flex",
                gap: 12,
                borderRadius: "10px",
              }}
            >
              <section
                className="content2"
                style={{
                  flex: 0.3,
                  width: "30%",
                  backgroundColor: "#fff",
                  padding: "12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                }}
              >
                {content2}
              </section>
              <section
                className="content3"
                style={{
                  backgroundColor: "#fff",
                  padding: "12px",
                  flex: 1,
                  width: "70%",
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                }}
              >
                {content3}
              </section>
            </section>
          </section>
        </section>
      </CloseOpenModal>
    );
  } else if (layoutType === 16) {
    return (
      <CloseOpenModal
        layoutType={16}
        floatButton={option?.floatButton}
        hideContent={option?.hideContent}
      >
        <section>
          <section
            className="content1"
            style={{
              width: "100%",
              backgroundColor: "#fff",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "10px",
              border: "1px solid #e0e0e0",
            }}
          >
            {content1}
          </section>
          <section
            style={{
              display: "flex",
              gap: "12px",
              backgroundColor: "transparent",
              borderRadius: "10px",
            }}
          >
            <section
              style={{
                flex: 7,
                width: "70%",
                borderRadius: "10px",
              }}
            >
              <section
                className="content2"
                style={{
                  width: "100%",
                  backgroundColor: "#fff",
                  padding: "12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                }}
              >
                {content2}
              </section>
            </section>
            <section
              className="content3"
              style={{
                flex: 3,
                width: "30%",
                padding: "12px",
                border: "1px solid #e0e0e0",
                backgroundColor: "#fff",
                borderRadius: "10px",
              }}
            >
              {content3}
            </section>
          </section>
        </section>
      </CloseOpenModal>
    );
  } else if (layoutType === 113) {
    let content2Flex = 1; // Default 25% (1 out of 4 parts)
    let content3Flex = 3; // Default 75% (3 out of 4 parts)

    if (option?.sizeAdjust) {
      content2Flex = option.sizeAdjust[0];
      content3Flex = option.sizeAdjust[1];
    }

    return (
      <CloseOpenModal
        layoutType={113}
        floatButton={option?.floatButton}
        hideContent={option?.hideContent}
      >
        <section
          className="layoutType113"
          style={{
            width: "100vw",
            height: "calc(100vh - 80px)",
            display: "flex",
            flexDirection: "column",
            gap: "1vh",
            paddingRight: "2vh",
            paddingBottom: "1vh",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          {/* Content1 - Auto height based on content */}
          <section
            className={`content1 ${
              option?.hideContent === 1 ? "hideContent" : ""
            }`}
            style={{
              width: "100%",
              minHeight: "50px",
              backgroundColor: "#fff",
              padding: "1vh",
              borderRadius: "0.8vh",
              border: "1px solid #e0e0e0",
              boxSizing: "border-box",
              overflow: "hidden",
              display: option?.hideContent === 1 ? "none" : "block",
              flexShrink: 0,
            }}
          >
            {content1}
          </section>

          {/* Main content area - remaining space */}
          <section
            style={{
              width: "100%",
              flex: 1,
              display: "flex",
              gap: "1vh",
              boxSizing: "border-box",
              minHeight: 0,
            }}
            className="layoutType113b"
          >
            {/* Content2 - Customizable with sizeAdjust */}
            <section
              className={`content2 ${
                option?.hideContent === 2 ? "hideContent" : ""
              }`}
              style={{
                flex: option?.hideContent === 2 ? 0 : content2Flex,
                backgroundColor: "#fff",
                padding: "1vh",
                borderRadius: "0.8vh",
                border: "1px solid #e0e0e0",
                boxSizing: "border-box",
                overflow: "auto",
                display: option?.hideContent === 2 ? "none" : "block",
                minHeight: 0,
                maxHeight: "100%",
              }}
            >
              {content2}
            </section>

            {/* Content3 - Customizable with sizeAdjust */}
            <section
              className={`content3 ${
                option?.hideContent === 3 ? "hideContent" : ""
              }`}
              style={{
                flex:
                  option?.hideContent === 3
                    ? 0
                    : option?.hideContent === 2
                    ? content2Flex + content3Flex
                    : content3Flex,
                backgroundColor: "#fff",
                padding: "1vh",
                borderRadius: "0.8vh",
                border: "1px solid #e0e0e0",
                boxSizing: "border-box",
                overflow: "auto",
                display: option?.hideContent === 3 ? "none" : "block",
                minHeight: 0,
                maxHeight: "100%",
              }}
            >
              {content3}
            </section>
          </section>
        </section>
      </CloseOpenModal>
    );
  }
  return null;
}

export default LayoutContent;
