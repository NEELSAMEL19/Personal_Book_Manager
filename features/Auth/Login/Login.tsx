import LoginForm from "./LoginForm";
import LoginTheme from "./LoginTheme";

const Login = () => {
  return (
    <div className="flex h-screen w-screen">
      <LoginTheme />
      <LoginForm />
    </div>
  );
};

export default Login;
