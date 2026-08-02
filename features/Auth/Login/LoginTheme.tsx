import Image from "next/image";

const LoginTheme = () => {
  return (
    <div className="relative hidden min-[850px]:block min-[850px]:w-[30%] h-full overflow-hidden">
      <Image
        src="/login_bg.png"
        alt="Login theme"
        fill
        sizes="30vw"
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
};

export default LoginTheme;
