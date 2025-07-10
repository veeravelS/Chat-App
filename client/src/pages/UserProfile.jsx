import { Input } from "../components/ui/input";
import Avatar from "../components/Avatar";
import Divider from "../components/Divider";
import uploadFile from "../helpers/uploadFile";
import { setUsers } from "../store/userSlice";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
const formSchema = z.object({
  profile_pic: z.string().optional(),
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
});
const UserProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState({
    name: user?.name,
    profile_pic: user?.profile_pic,
    email: user?.email,
  });
  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name,
      profile_pic: data.profile_pic,
      email: data.email,
    },
  });

  useEffect(() => {
    setData((prev) => ({ ...prev, ...user }));
  }, []);

  const handleUploadPhoto = async (e) => {
    const files = e.target.files[0];
    const uploadPhoto = await uploadFile(files);
    setData((prev) => ({ ...prev, profile_pic: uploadPhoto.secure_url }));
    form.setValue("profile_pic", uploadPhoto.secure_url, {
      shouldValidate: true,
    });
  };

  const handleOpenUploadPhoto = () => {
    uploadPhotoRef.current.click();
  };

  const fetchUserDetails = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        return;
      }
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/user-details`;
      const response = await axios.get(URL, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      console.log(response);
      setData((prev) => ({ ...prev, ...response.data.data })); 
      const data = response.data.data ; 
  // ✅ Reset form values in one go
    form.reset({
      name: data.name || "",
      email: data.email || "",
      profile_pic :data.profile_pic || "",
    });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const onSubmit = async (values) => {
    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/update-user`;
      const response = await axios.post(
        URL,
        { ...values },
        { withCredentials: true }
      );
      toast.success(response?.data?.message);
      if (response.data.success) {
        dispatch(setUsers(response?.data?.data));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <Form {...form} className="w-full">
      <h2 className="font-semibold text-2xl mt-4 mb-6">Personal Information</h2>
      <Divider />
      <form
        className="grid gap-3 grid-col-2 mt-3"
        onSubmit={form.handleSubmit(onSubmit)}
        action=""
      >
        <div className="my-1 flex relative col-span-2 w-full items-center gap-3">
          <Avatar
            width={100}
            height={100}
            imageUrl={data?.profile_pic}
            name={data?.name}
          />
          <label htmlFor="profile_pic ">
            <button
              type="button"
              className="font-semibold rounded-full p-1 border border-gray-600 absolute -bottom-2 left-[95px]"
              onClick={handleOpenUploadPhoto}
            >
              <Camera />
            </button>
            <input
              type="file"
              id="profile_pic"
              className="hidden"
              onChange={handleUploadPhoto}
              ref={uploadPhotoRef}
            />
          </label>
        </div>
        <div className="col-span-1 gap-1">
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
        </div>
        <div>
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
        </div>
        <div className="col-span-2 py-5 gap-1">
          <Divider />
        </div>
        <div className="flex justify-end gap-2 mt-3 col-span-2 w-full mr-auto">
          <Button
            type="submit"
            className="border-secondary border bg-primary text-white px-7 py-1 rounded"
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserProfile;
