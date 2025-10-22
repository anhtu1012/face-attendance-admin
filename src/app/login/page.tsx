/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { setAuthData } from "@/lib/store/slices/loginSlice";
import AuthServices from "@/services/auth/api.service";
import { reconnectSocketWithNewToken } from "@/hooks/useSocket";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import backgroundImage from "../../../public/assets/image/BackgroundFaceAI.png";
import "./login.scss";

interface LoginForm {
  username: string;
  password: string;
}
const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [signInForm] = useForm<LoginForm>();
  const [isNavigating, setIsNavigating] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const onFinish = async (values: any) => {
    if (isLogin || isNavigating) return;
    setIsLogin(true);

    try {
      const res = await AuthServices.login(values);
      dispatch(setAuthData(res));
      toast.success("Đăng nhập thành công");
      // Set tokens and store data
      AuthServices.setToken(res.accessToken);
      AuthServices.setRefreshToken(res.refreshToken);

      // Reconnect socket với token mới
      setTimeout(() => {
        reconnectSocketWithNewToken();
      }, 300);

      setIsNavigating(true);
      router.push("/");
    } catch (error: any) {
      console.log(error);
      toast.error("Đăng nhập thất bại");
      setIsLogin(false);
      setIsNavigating(false);
    } finally {
      // Ensure loading flag is cleared. Do NOT set navigating=true here because
      // finally runs on both success and failure and previously caused the
      // spinner to keep spinning after a failed login.
      setIsLogin(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-form">
          <Title level={1} className="login-title">
            Get Started Now
          </Title>
          <Text className="login-subtitle">
            Enter your credentials to access your account
          </Text>

          <Form
            name="login"
            form={signInForm}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            size="large"
            style={{ width: "100%" }}
            className="login-form-container"
          >
            <Form.Item
              label="Name"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Enter your username"
                disabled={isLogin || isNavigating}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Enter your password"
                disabled={isLogin || isNavigating}
              />
            </Form.Item>

            <div className="login-links">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="login-checkbox">
                  I agree to the Terms & Privacy
                </Checkbox>
              </Form.Item>
              <Link href="/forgot-password" className="login-forgot">
                Forgot password?
              </Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={isLogin || isNavigating}
                block
              >
                {isLogin
                  ? "Đang đăng nhập..."
                  : isNavigating
                  ? "Đang chuyển trang..."
                  : "Đăng Nhập"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="login-right">
        <div className="image-container">
          <Image
            src={backgroundImage}
            alt="Facial Recognition"
            className="background-image"
            width={1000}
            height={1000}
            style={{ width: "100%", height: "auto" }}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
