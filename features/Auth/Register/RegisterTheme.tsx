import Image from "next/image";

const RegisterTheme = () => {
  return (
    <div className="relative hidden min-[850px]:block min-[850px]:w-[30%] h-full overflow-hidden">
      <Image
        src="/register_bg.png"
        alt="Register theme"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
};

export default RegisterTheme;
