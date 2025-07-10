import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { Button } from "../../components/ui/button";
import axios from "axios";
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
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().min(1, { message: "Email is required" })
            .email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" })
            .min(6, { message: "Password must be at least 6 characters" }),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept terms and conditions" }),
  }),
});

const SignUp = ({ activeTab, setActiveTab }) => {
  const [show, setShow] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
    mode: "onChange", // Validate on each change
  });

  const onSubmit = async (values) => {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/register`;
    try {
      const response = await axios.post(URL, { ...values });
      toast.success(response?.data?.message);
      if (response.data.success) {
        form.reset();
        setActiveTab("login");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
      console.log(error);
    }
  };

  const handleLoginOpen = () => {
    setActiveTab("login");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[24rem] space-y-6">
        <h1 className="text-3xl font-semibold text-start">Create an account</h1>
        
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your name" 
                  {...field} 
                  onBlur={() => form.trigger("name")}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500 min-h-[20px] block" />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your email" 
                  {...field} 
                  onBlur={() => form.trigger("email")}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500 min-h-[20px] block" />
            </FormItem>
          )}
        />

        {/* Password Field */}
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
                    className="pr-10"
                    onBlur={() => form.trigger("password")}
                  />
                  <div
                    className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                    onClick={() => setShow((prev) => !prev)}
                  >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-xs text-red-500 min-h-[20px] block" />
            </FormItem>
          )}
        />

        {/* Terms Checkbox */}
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center  space-x-3 space-y-0 rounded-md">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="cursor-pointer">
                  Accept terms and conditions
                </FormLabel>
                <FormMessage className="text-xs text-red-500 min-h-[20px] block" />
              </div>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full mt-2 text-black"
          disabled={!form.formState.isValid}
        >
          Sign Up
        </Button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <span
            onClick={handleLoginOpen}
            className="underline hover:cursor-pointer hover:text-primary"
          >
            Sign in
          </span>
        </p>
      </form>
    </Form>
  );
};

export default SignUp;