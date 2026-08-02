import { Button, TextField } from "@/components/UI";
import Link from "next/link";

const RegisterForm = () => {
  return (
    <div className="w-full min-[850px]:w-[70%] flex items-center justify-center h-full p-6 ">
      <div className="w-full max-w-md bg-white drop-shadow-xs rounded-2xl p-8">
        <form className="flex flex-col gap-5">
          <TextField
            label="Email"
            type="email"
            name="email"
            required
            maxLength={100}
            placeholder="Email"
            autoComplete="email"
            // value={formData.email}
            // onChange={handleChange("email")}
            // color={errors.email ? "error" : status.email}
            // error={errors.email || ""}
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            placeholder="Password"
            required
            maxLength={100}
            autoComplete="current-password"
            // value={formData.password}
            // onChange={handleChange("password")}
            // color={errors.password ? "error" : status.password}
            // error={errors.password || ""}
          />

          <Button
            type="submit"
            size="md"
            // isLoading={loginMutation.isPending}
            className="w-full"
          >
            Create account
          </Button>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              prefetch={false}
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
