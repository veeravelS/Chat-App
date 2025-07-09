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
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept terms and conditions" }),
  }),
});
const SignUp = ({ activeTab, setActiveTab }) => {
  const [show,setShow] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false, // Default value for terms checkbox
    },
  });
  // const handleUploadPhoto = async (e) => {
  //   const files = e.target.files[0];
  //   const uploadPhoto = await uploadFile(files);
  //   setData((prev)=>({...prev,profile_pic:uploadPhoto.secure_url}))
  //   setUploadPhoto(files);
  // };

  // const handleClearUploadPhoto = () => {
  //   setUploadPhoto("");
  // };

  const onSubmit = async (values) => {
    console.log("values", values);
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
    console.log("login open");
  };
  return (
    <Form {...form} className="w-full">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-[60%]">
        <h1 className="text-3xl font-semibold text-start">Create an account</h1>
        <div className="flex flex-col gap-3 w-full mt-10">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          {/* <div className="grid w-full max-w-[90%]  items-center gap-3">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            placeholder="Enter Name"
            className="w-full"

          />
        </div>
        <div className="grid w-full max-w-[90%] items-center gap-3">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" placeholder="Enter Email" />
        </div>
        <div className="grid w-full max-w-[90%] items-center gap-3">
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" placeholder="Enter Password" />
        </div> */}
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex justify-start items-center space-x-2">
                <FormControl>
                  <Checkbox
                    id="terms"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel htmlFor="terms" className="pb-2">
                  Accept terms and conditions
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="secondary"
            className="w-[100%] mt-2 bg-[#efefef] text-black"
          >
            Sign Up
          </Button>
          <p className="text-center text-sm">
            Already have an account?{" "}
            <span
              onClick={handleLoginOpen}
              className="underline hover:cursor-pointer"
            >
              Sign in
            </span>
          </p>
        </div>
      </form>
    </Form>
  );
};

export default SignUp;
