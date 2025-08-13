import { createSlice } from "@reduxjs/toolkit";


const draftSlice = createSlice({
    name: "draftPostEdit",
    initialState: {
        title: "",
        subtitle: "",
        content: {
            time: 0,
            blocks: [],
            version: "2.26.0" // Default version, can be updated later
        },
        bannerImageUrl: "",
        isEditingDraft: false,
        editingBlogId: null
    },
    reducers: {
        setDraftData: (state, { payload }) => {
            state.title = payload.title || "";
            state.subtitle = payload.subtitle || "";
            state.content = payload.content || { time: 0, blocks: [], version: "2.26.0" };
            state.bannerImageUrl = payload.bannerImageUrl || "";
            state.isEditingDraft = payload.isEditingDraft || false;
            state.editingBlogId = payload.editingBlogId || null;
        },
        clearDraftData: (state) => {
            state.title = "";
            state.subtitle = "";
            state.content = { time: 0, blocks: [], version: "2.26.0" };
            state.bannerImageUrl = "";
            state.isEditingDraft = false;
            state.editingBlogId = null;
        },
        updateDraftField: (state, { payload }) => {
            const { field, value } = payload;
            (state as any)[field] = value;
        }
    }
});

export const { setDraftData, clearDraftData, updateDraftField } = draftSlice.actions;
export default draftSlice.reducer;