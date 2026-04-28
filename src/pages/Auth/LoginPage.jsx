import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Divider,
  message,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { clearClientSessionState } from "@/lib/clientCache";
import useClientAuthStatus from "@/hooks/useClientAuthStatus";
import { userLogin } from "@/services/userService";
import { setUser } from "@/stores/user";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  clearClientTokens,
  clearClientTokensSession,
  getClientPostLoginPath,
  setClientAccessToken,
  setClientAccessTokenSession,
} from "@/utils/auth";
import { API_URL, APP_NAME } from "@/utils/env";
import { getAuthTheme } from "./authTheme";
import AuthLanguageToggle from "./AuthLanguageToggle";
import "./LoginPage.scss";

const LoginPage = () => {
  const { t } = useTranslation("clientAuth");
  const dispatch = useDispatch();
  const websiteConfig = useSelector((state) => state.websiteConfig.data);
  const isDarkMode = useSelector((state) => !!state.darkMode?.value);
  const C = getAuthTheme(isDarkMode);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isHoverForgot, setIsHoverForgot] = useState(false);
  const { isAuthenticated, isChecking } = useClientAuthStatus();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(getClientPostLoginPath(location.state?.from), { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { identity, password, remember } = values;
      const res = await userLogin({ identity, password, remember });

      if (res.error) {
        message.error(res.error);
      } else {
        message.success(t("login.messages.success"));

        clearClientTokens();
        clearClientTokensSession();
        clearClientSessionState(dispatch);

        if (remember) {
          localStorage.setItem("user", JSON.stringify(res.user));
          setClientAccessToken(res.clientAccessToken);
        } else {
          sessionStorage.setItem("user", JSON.stringify(res.user));
          setClientAccessTokenSession(res.clientAccessToken);
        }

        dispatch(setUser({ user: res.user, token: res.clientAccessToken }));

        navigate(getClientPostLoginPath(location.state?.from), { replace: true });
      }
    } catch {
      message.error(t("login.messages.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    if (provider === "Google") {
      window.open(`${API_URL}/user/google`, "_self");
    } else if (provider === "Facebook") {
      window.open(`${API_URL}/user/facebook`, "_self");
    } else if (provider === "GitHub") {
      window.open(`${API_URL}/user/github`, "_self");
    }
  };

  if (isChecking || isAuthenticated) return null;

  return (
    <div
      className="sovereign-auth-page sovereign-auth-page--login"
      style={{
        minHeight: "100vh",
        background: C.surface,
        color: C.onSurface,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <SEO title={t("login.seoTitle")} noIndex />

      <header
        className="sovereign-auth-header"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: C.headerBackground,
          boxShadow: C.headerShadow,
        }}
      >
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 2rem",
            maxWidth: "80rem",
            margin: "0 auto",
          }}
        >
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.625rem",
              textDecoration: "none",
            }}
          >
            {websiteConfig?.logoUrl ? (
              <img
                src={websiteConfig.logoUrl}
                alt={websiteConfig?.siteName || "Logo"}
                style={{
                  width: "2.25rem",
                  height: "2.25rem",
                  objectFit: "contain",
                  background: C.logoBackground,
                  borderRadius: "0.375rem",
                  boxShadow: C.logoShadow,
                }}
              />
            ) : null}

            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                fontFamily: "Manrope, sans-serif",
                color: C.primary,
                letterSpacing: "-0.04em",
              }}
            >
              {websiteConfig?.siteName ||
                APP_NAME ||
                "Sovereign"}
            </span>
          </Link>

          <div
            className="sovereign-auth-nav-actions"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                color: C.onSurfaceVariant,
                padding: "0.25rem 0.75rem",
                borderRadius: "0.75rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 500,
                textDecoration: "none",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = C.surfaceContainerLow)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "1rem" }}
              >
                home
              </span>
              <span>{t("shared.nav.home")}</span>
            </Link>

            {[
              { icon: "help", to: "/faq" },
              { icon: "info", to: "/about" },
            ].map(({ icon, to }) => (
              <Link
                key={icon}
                to={to}
                aria-label={t(`shared.nav.${icon}`)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  color: C.onSurfaceVariant,
                  padding: "0.25rem 0.75rem",
                  borderRadius: "0.75rem",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  border: "none",
                  background: "transparent",
                  transition: "background 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = C.surfaceContainerLow)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "1rem" }}
                >
                  {icon}
                </span>
                <span>{t(`shared.nav.${icon}`)}</span>
              </Link>
            ))}

            <AuthLanguageToggle colors={C} />
          </div>
        </nav>
      </header>

      <main
        className="sovereign-auth-main"
        style={{
          display: "flex",
          flex: 1,
          height: "calc(100vh - 4rem)",
          paddingTop: "4rem",
          overflow: "hidden",
        }}
      >
        <section
          className="sovereign-left-panel"
          style={{
            width: "45%",
            flex: "0 0 45%",
            height: "calc(100vh - 4rem)",
            position: "sticky",
            top: 0,
            overflow: "hidden",
            display: "flex",
            alignItems: "flex-start",
            background: C.leftPanelBackground,
          }}
        >
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuACe3IlpkpA5MRMYLbvo78c6QZClHSwMUL-D2OU4TRpVnaAPXf4IIoq94S2MmUtm7dV9FIeA4OwDELo4F6cFbOkX3jhNye0-CqlmvKREe9w-Js096Zs6JpK4JAzI56015zq9QcB5JpVpCLQhcCJ3TUq5gYgly3EAytdv2QG6-4XEbNxXRp1OAOAyGIYmRvYyuDU3Qmry-PkWwzw2jmcaNuiGmZdA-VngkTDfXtH_zhdwx-6-R6u2YHVCvZx389GIqs1lpDI2UV1ARw"
              alt={t("shared.hero.backgroundAlt")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: C.heroImageOpacity,
                mixBlendMode: C.heroImageBlendMode,
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background: C.heroOverlay,
              }}
            />
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 10,
              padding: "4.5rem 3rem 3.5rem",
              maxWidth: "32rem",
            }}
          >
            <h1
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: "1.5rem",
              }}
            >
              {t("login.hero.title").split("\n").map((line, index) => (
                <React.Fragment key={line}>
                  {index > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
            </h1>

            <p
              style={{
                fontSize: "1.125rem",
                color: C.primaryFixed,
                lineHeight: 1.7,
                fontWeight: 300,
                marginBottom: "3rem",
                maxWidth: "28rem",
              }}
            >
              {t("login.hero.description")}
            </p>

            <div
              style={{
                position: "relative",
                paddingLeft: "2rem",
                borderLeft: `2px solid ${C.quoteBorder}`,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  position: "absolute",
                  left: "-1.25rem",
                  top: "-1.5rem",
                  fontSize: "4rem",
                  color: C.quoteMark,
                  userSelect: "none",
                }}
              >
                format_quote
              </span>

              <blockquote
                style={{
                  color: C.quoteText,
                  fontStyle: "italic",
                  fontSize: "1rem",
                  lineHeight: 1.7,
                }}
              >
                "{t("login.hero.quote")}"
              </blockquote>

              <p
                style={{
                  marginTop: "1rem",
                  color: C.primaryFixed,
                  fontWeight: 500,
                  fontSize: "0.6875rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                {t("shared.hero.quoteAuthor", { appName: APP_NAME || "Sovereign" })}
              </p>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: "3rem",
              right: "3rem",
              bottom: "3.5rem",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              color: C.primaryFixed,
            }}
          >
            <span
              style={{
                fontFamily: "Manrope, sans-serif",
                fontWeight: 600,
                color: "#ffffff",
              }}
            >
              {t("shared.footer.registrar", { appName: APP_NAME || "Sovereign" })}
            </span>

            <span style={{ fontSize: "0.8125rem", color: C.primaryFixed }}>
              {t("shared.footer.copyright", { appName: APP_NAME || "Sovereign" })}
              {" "}
              {t("shared.footer.rights")}
            </span>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem 1.25rem",
                marginTop: "0.25rem",
              }}
            >
              {[
                { label: t("shared.footer.terms"), to: "/terms-of-service" },
                { label: t("shared.footer.privacy"), to: "/privacy-policy" },
                { label: t("shared.footer.security"), to: "/privacy-policy" },
                { label: t("shared.footer.contact"), to: "/contact" },
              ].map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  style={{
                    fontSize: "0.8125rem",
                    color: C.primaryFixed,
                    textDecoration: "none",
                    transition: "opacity 0.2s",
                    opacity: 0.9,
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = "1")}
                  onMouseLeave={(e) => (e.target.style.opacity = "0.9")}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section
          className="sovereign-right-panel"
          style={{
            width: "55%",
            flex: "1 1 55%",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            background: C.surfaceContainerLow,
            padding: "2rem 1.5rem 3rem",
            maxHeight: "calc(100vh - 4rem)",
            overflowY: "auto",
          }}
        >
          <div
            className="sovereign-auth-card"
            style={{
              width: "100%",
              maxWidth: "28rem",
              background: C.cardBackground,
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderRadius: "2rem",
              padding: "2.5rem",
              boxShadow: C.cardShadow,
              border: C.cardBorder,
            }}
          >
            <div style={{ marginBottom: "2rem" }}>
              <h2
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: C.onSurface,
                  marginBottom: "0.375rem",
                }}
              >
                {t("login.form.title")}
              </h2>

              <p
                style={{
                  color: C.onSurfaceVariant,
                  fontSize: "0.9375rem",
                  margin: 0,
                }}
              >
                {t("login.form.description")}
              </p>
            </div>

            <div
              className="sovereign-login-input"
              style={{ margin: "0 0.25rem" }}
            >
              <Form
                form={form}
                name="login"
                onFinish={onFinish}
                layout="vertical"
                size="middle"
              >
                <Form.Item
                  label={t("login.form.identityLabel")}
                  name="identity"
                  rules={[
                    {
                      required: true,
                      message: t("login.form.identityRequired"),
                    },
                  ]}
                  style={{ marginBottom: "1.25rem" }}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder={t("login.form.identityPlaceholder")}
                    autoComplete="username"
                  />
                </Form.Item>

                <Form.Item
                  label={t("login.form.passwordLabel")}
                  name="password"
                  rules={[
                    { required: true, message: t("login.form.passwordRequired") },
                    { min: 6, message: t("login.form.passwordMin") },
                  ]}
                  style={{ marginBottom: "1rem" }}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder={t("login.form.passwordPlaceholder")}
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    autoComplete="current-password"
                  />
                </Form.Item>

                <div
                  className="sovereign-login-options-row"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <Form.Item
                    name="remember"
                    valuePropName="checked"
                    style={{ margin: 0 }}
                  >
                    <Checkbox>
                      <span
                        style={{
                          color: C.onSurfaceVariant,
                          fontSize: "0.875rem",
                        }}
                      >
                        {t("login.form.remember")}
                      </span>
                    </Checkbox>
                  </Form.Item>

                  <Link
                    to="/user/forgot-password"
                    onMouseEnter={() => setIsHoverForgot(true)}
                    onMouseLeave={() => setIsHoverForgot(false)}
                    style={{
                      fontSize: "0.875rem",
                      color: isHoverForgot ? C.primaryContainer : C.primary,
                      fontWeight: 600,
                      textDecoration: isHoverForgot ? "underline" : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {t("login.form.forgotPassword")}
                  </Link>
                </div>

                <Form.Item style={{ marginBottom: "1rem" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="sovereign-btn-primary"
                    style={{
                      width: "100%",
                      height: "3.25rem",
                      color: "#ffffff",
                    }}
                  >
                    {loading ? t("login.form.submitting") : t("login.form.submit")}
                  </Button>
                </Form.Item>

                <Divider style={{ margin: "0.5rem 0 1rem" }}>
                  {t("login.form.socialDivider")}
                </Divider>

                <div
                  className="sovereign-auth-social-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "0.75rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {[
                    {
                      key: "Google",
                      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png",
                    },
                    {
                      key: "GitHub",
                      img: "https://cdn-icons-png.flaticon.com/512/25/25231.png",
                    },
                    {
                      key: "Facebook",
                      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/960px-2023_Facebook_icon.svg.png",
                    },
                  ].map(({ key, img }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSocialLogin(key)}
                      className="sovereign-btn-social"
                      style={{
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      <img
                        src={img}
                        alt={key}
                        style={{
                          width: "1.25rem",
                          height: "1.25rem",
                          objectFit: "contain",
                        }}
                      />
                      <span>{t(`shared.providers.${key.toLowerCase()}`)}</span>
                    </button>
                  ))}
                </div>

                <p
                  style={{
                    textAlign: "center",
                    fontSize: "0.875rem",
                    color: C.onSurfaceVariant,
                    margin: 0,
                  }}
                >
                  {t("login.form.noAccount")}{" "}
                  <Link
                    to="/user/register"
                    style={{
                      color: C.primary,
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    {t("login.form.registerNow")}
                  </Link>
                </p>
              </Form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
