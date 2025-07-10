import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../components/ui/form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken, setUsers } from "../../store/userSlice";
import axios from "axios";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const SignIn = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show,setShow] = useState(false);
  const handleRegisterOpen = () => {
    setActiveTab("register");
    console.log("register open");
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/login`;
    try {
      const response = await axios.post(
        URL,
        { ...values },
        { withCredentials: true }
      );
      toast.success(response?.data?.message);
      form.reset();
      dispatch(setUsers(response?.data.data));
      // localStorage.setItem("userDetails", JSON.stringify(response?.data.data));
      dispatch(setToken(response?.data?.token));
      localStorage.setItem("token", response?.data?.token);
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Sign in failed");
      console.log(error);
    }
  };
  return (
    <Form {...form} className="w-full">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-[60%]"
      >
        <h1 className="text-3xl font-semibold text-start">Sign In</h1>
        <div className="flex flex-col gap-3 mt-10">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={show ? "text" : "password"}
                      placeholder="Enter your password"
                      {...field}
                      className="pr-10" // space for the icon
                    />
                    <div
                      className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                      onClick={() => setShow((prev) => !prev)}
                    >
                      {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full mt-5 hover:bg-white text-black">
            Sign In
          </Button>
          <p className="text-center text-sm">
            Don't have an account?{" "}
            <span
              onClick={handleRegisterOpen}
              className="underline cursor-pointer"
            >
              Sign up
            </span>
          </p>
        </div>
      </form>
    </Form>
  );
};

export default SignIn;
