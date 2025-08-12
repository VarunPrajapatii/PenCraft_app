import { useState } from "react";
import { useChangeBio } from "../../hooks/userHooks";
import { UserProfileDetails } from "../../hooks/hooksTypes";
import BioEditIcon from "../Icons/BioEditIcon";

interface BioSectionProps {
    userProfileDetails: UserProfileDetails | undefined;
    isOwnProfile: boolean;
    loggedInUserId: string | null;
    onBioUpdate?: () => void; // Callback to refresh profile data
}

const BioSection = ({ userProfileDetails, isOwnProfile, loggedInUserId, onBioUpdate }: BioSectionProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [bioText, setBioText] = useState(userProfileDetails?.bio || "");
    const [updateStatus, setUpdateStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const { bioChangeLoading, changeBio } = useChangeBio();

    const handleEditClick = () => {
        setIsEditing(true);
        setBioText(userProfileDetails?.bio || "");
        setUpdateStatus('idle');
    };

    const handleSave = async () => {
        if (!loggedInUserId) return;

        try {
            const response = await changeBio(loggedInUserId, bioText);
            if (response.success) {
                setUpdateStatus('success');
                setIsEditing(false);
                // Call the callback to refresh profile data
                if (onBioUpdate) {
                    onBioUpdate();
                }
                // Auto-hide success message after 3 seconds
                setTimeout(() => setUpdateStatus('idle'), 3000);
            } else {
                setUpdateStatus('error');
            }
        } catch (error) {
            console.error("Failed to update bio:", error);
            setUpdateStatus('error');
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setBioText(userProfileDetails?.bio || "");
        setUpdateStatus('idle');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    // For own profile: show bio or placeholder message with edit icon
    // For other users: show bio only if it exists, otherwise hide the section
    const shouldShowBioSection = isOwnProfile || userProfileDetails?.bio;
    const displayBio = userProfileDetails?.bio || (isOwnProfile ? "Change your bio by clicking the edit icon." : "");

    if (!shouldShowBioSection) {
        return null; // Don't render anything if it's not own profile and no bio exists
    }

    return (
        <div className="mt-4 sm:mt-5 md:mt-6 text-center max-w-xs">
            {!isEditing ? (
                <p className="flex items-center justify-center gap-1 flex-wrap">
                    <span className="font-body text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        {displayBio}
                    </span>
                    {isOwnProfile && (
                        <button
                            onClick={handleEditClick}
                            className="inline-flex items-center justify-center ml-1 hover:scale-110 transition-transform duration-200"
                            title="Edit bio"
                        >
                            <BioEditIcon />
                        </button>
                    )}
                </p>
            ) : (
                <div className="w-full">
                    <textarea
                        value={bioText}
                        onChange={(e) => setBioText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md 
                                 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 
                                 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-400
                                  min-h-[60px] max-h-[120px]"
                        placeholder="Write a bio for your profile..."
                        maxLength={200}
                        autoFocus
                    />
                    <div className="flex justify-center gap-2 mt-2">
                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={bioChangeLoading}
                            className="group relative inline-flex items-center cursor-pointer rounded-full bg-blue-600
                                      px-4 py-2 sm:px-3 sm:py-2 md:px-5 md:py-2 text-sm sm:text-base md:text-lg
                                      font-subtitle font-semibold text-white shadow transition-all duration-200
                                      hover:bg-blue-700 hover:shadow-lg hover:scale-105
                                      active:scale-95 active:shadow
                                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400
                                      disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
                        >
                            {bioChangeLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <span className="transition-transform duration-200 group-hover:translate-x-1">
                                    Save
                                </span>
                            )}
                        </button>
                        {/* Cancel Button */}
                        <button
                            onClick={handleCancel}
                            disabled={bioChangeLoading}
                            className="group relative inline-flex items-center cursor-pointer rounded-full bg-gray-200 dark:bg-gray-700
                                      px-4 py-2 sm:px-3 sm:py-2 md:px-5 md:py-2 text-sm sm:text-base md:text-lg
                                      font-subtitle font-semibold text-black dark:text-white shadow transition-all duration-200
                                      hover:bg-gradient-to-r hover:from-blue-400/30 hover:to-red-400/30
                                      dark:hover:from-blue-500/30 dark:hover:to-red-500/30
                                      hover:shadow-lg hover:scale-105
                                      active:scale-95 active:shadow
                                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400
                                      disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
                        >
                            <span className="transition-transform duration-200 group-hover:translate-x-1 group-hover:text-red-700 dark:group-hover:text-red-400">
                                Cancel
                            </span>
                        </button>

                        
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {bioText.length}/200 characters • Ctrl+Enter to save • Esc to cancel
                    </div>
                </div>
            )}

            {/* Status messages */}
            {updateStatus === 'success' && (
                <div className="font-body mt-2 text-xs text-green-600 font-medium">
                    ✅ Bio updated successfully!
                </div>
            )}
            {updateStatus === 'error' && (
                <div className="font-body mt-2 text-xs text-red-600 font-medium">
                    ❌ Failed to update bio. Please try again.
                </div>
            )}
        </div>
    );
};

export default BioSection;
