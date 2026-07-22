import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
    getProfile,
    updateProfile,
} from "../services/user.service";

function Profile() {

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [profile, setProfile] = useState(null);

    const [name, setName] = useState("");

    const [image, setImage] = useState(null);

    useEffect(() => {

        fetchProfile();

    }, []);

    const fetchProfile = async () => {

        try {

            const response = await getProfile();

            setProfile(response.user);

            setName(response.user.name);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to load profile"
            );

        } finally {

            setLoading(false);

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);

            const formData = new FormData();

            formData.append("name", name);

            if (image) {
                formData.append("profileImage", image);
            }

            const response = await updateProfile(formData);

            toast.success(response.message);

            setProfile(response.user);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to update profile"
            );

        } finally {

            setSaving(false);

        }

    };

    if (loading) {
        return (
            <h2 className="text-center mt-10">
                Loading...
            </h2>
        );
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white shadow rounded-lg p-8">

            <h1 className="text-3xl font-bold mb-8">
                My Profile
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                <div className="flex justify-center">

                    <img
                        src={
                            profile?.profileImage?.url ||
                            "https://via.placeholder.com/150"
                        }
                        alt="Profile"
                        className="w-36 h-36 rounded-full object-cover border"
                    />

                </div>

                <div>

                    <label className="block mb-2 font-semibold">
                        Change Profile Picture
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setImage(e.target.files[0])
                        }
                    />

                </div>

                <div>

                    <label className="block mb-2 font-semibold">
                        Name
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                    />

                </div>

                <div>

                    <label className="block mb-2 font-semibold">
                        Email
                    </label>

                    <input
                        type="email"
                        value={profile?.email}
                        disabled
                        className="w-full border rounded-lg p-3 bg-gray-100"
                    />

                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                    {saving ? "Updating..." : "Update Profile"}
                </button>

            </form>

        </div>
    );
}

export default Profile;