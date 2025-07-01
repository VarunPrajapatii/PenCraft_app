import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";
import Code from "@editorjs/code";
import Marker from "@editorjs/marker";
import Quote from "@editorjs/quote";
import InlineCode from "@editorjs/inline-code";
import ImageTool from "@editorjs/image";

export function getEditorTools() {
    return {
        header: {
            class: Header,
            config: {
                placeholder: "Type Heading...",
                levels: [1, 2, 3],
                defaultLevel: 2,
            },
            inlineToolbar: ["bold", "italic", "link"],
        },
        paragraph: {
            class: Paragraph,
            inlineToolbar: true,
        },
        list: {
            class: List,
            inlineToolbar: true,
        },
        code: {
            class: Code,
        },
        quote: {
            class: Quote,
            inlineToolbar: true,
        },
        marker: Marker,
        InlineCode: InlineCode,
        image: {
            class: ImageTool,
            config: {
                uploader: {
                    async uploadByFile(file: File) {
                        // Initialize the map if it doesn't exist
                        window.pendingBlogImages = window.pendingBlogImages || new Map();
                        
                        // Check if we've reached the limit of 15 images
                        if (window.pendingBlogImages.size >= 15) {
                            // Show error message and reject the upload
                            alert("❌ Image Upload Limit Reached!\n\nYou can only upload a maximum of 15 images per blog post. Please remove some images before adding new ones.");
                            
                            return {
                                success: 0,
                                error: "Maximum image limit (15) reached. Please remove some images before adding new ones."
                            };
                        }

                        // Store file reference for later batch upload
                        const fileId = crypto.randomUUID();
                        const blobUrl = URL.createObjectURL(file);

                        // Store file in a global map for later upload
                        window.pendingBlogImages = window.pendingBlogImages || new Map();
                        window.pendingBlogImages.set(fileId, {
                            file,
                            blobUrl,
                            uploaded: false,
                        });

                        return {
                            success: 1,
                            file: {
                                url: blobUrl,
                                fileId: fileId, // ive added this field to track file
                                name: file.name,
                                size: file.size,
                            },
                        };
                    },
                },
            },
        },
    };
}
