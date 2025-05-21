import { Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { FC } from "react";
import { InputImageStore, useInputImage } from "./input-image-store";

// Check if Vision is enabled - client-side check
const isVisionEnabled = () => {
  // On the client side, access environment variables through Next.js public runtime config
  // This will need to be properly configured in next.config.js
  return process.env.NEXT_PUBLIC_ENABLE_VISION === "true";
};

export const ImageInput: FC = () => {
  const { base64Image, previewImage } = useInputImage();
  
  // Return null if Vision is disabled
  if (!isVisionEnabled()) {
    return null;
  }

  return (
    <div className="w-full flex flex-col">
      <div className="relative inline-block w-full px-5">
        <button
          className="absolute top-2 right-4"
          onClick={() => {
            InputImageStore.Reset();
          }}
        >
          <span className="sr-only">Reset image input</span>
          <X size={20} className="opacity-40 hover:opacity-100 transition-opacity" />
        </button>
        {previewImage && (
          <div className="relative h-56 w-full rounded-lg overflow-hidden my-2">
            <Image src={previewImage} alt="Preview" fill={true} />
            <div className="absolute top-0 right-0">
              <button
                aria-label="Remove image from chat input"
                onClick={() => InputImageStore.Reset()}
                className="p-1 m-1 rounded-lg bg-neutral-800/20 hover:bg-neutral-800/40 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}
        <input
          type="hidden"
          name="image-base64"
          value={base64Image}
          onChange={(e) => InputImageStore.UpdateBase64Image(e.target.value)}
        />
        <label htmlFor="fileUpload" className="flex items-center space-x-1 w-fit h-fit">
          <input
            accept="image/*"
            name="image"
            id="fileUpload"
            type="file"
            className="sr-only"
            onChange={(e) => InputImageStore.OnFileChange(e)}
          />
          <div className="flex items-center gap-1 cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
            <button
              type="button"
              aria-label="Add an image to the chat input"
              className="hover:bg-neutral-200 rounded-md p-2 dark:hover:bg-neutral-600"
            >
              <ImageIcon size={16} />
            </button>
          </div>
        </label>
      </div>
    </div>
  );
};
