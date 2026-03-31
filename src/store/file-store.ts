import { create } from "zustand";
import {
  uploadFile,
  updateFile,
  deleteFile as apiDeleteFile,
  getMyFiles,
  getAllUsers,
} from "@/lib/api";
import type { FileDetailsDTO, FileResponseDTO, FileUploadRequest } from "@/types";


export interface LocalFile {
  shareId: string;
  title: string;
}

interface FileState {
  files: FileDetailsDTO[];
  loading: boolean;
  error: string | null;

  fetchFiles: () => Promise<void>;

  upload: (data: FileUploadRequest) => Promise<FileResponseDTO>;

  update: (
    shareId: string,
    data: FileUploadRequest
  ) => Promise<FileResponseDTO>;

  remove: (shareId: string) => Promise<void>;
}



export const useFileStore = create<FileState>((set, get) => ({
  files: [],
  loading: false,
  error: null,

  fetchFiles: async () => {
    set({ loading: true, error: null });
    try {
      // Fetch both files and students (users)
      const [filesData, studentsData] = await Promise.all([
        getMyFiles(),
        getAllUsers().catch(() => []) // Fallback to empty if users endpoint fails
      ]);

      // Map students (users) to look like FileDetailsDTO for the Dashboard UI
      const studentFiles: FileDetailsDTO[] = studentsData.map((s) => ({
        shareId: s.id,
        title: s.username,
        description: `Student Email: ${s.email}`,
        fileType: "application/student-profile",
        owner: s.username,
        previewUrl: "",
        fileSize: 0,
      }));

      // Combine them (students first or files first?)
      // Let's put students first as it's now a Student Portal
      set({ files: [...studentFiles, ...filesData], loading: false });
    } catch {
      // stay silent and show empty list on error
      set({ files: [], loading: false });
    }
  },

  upload: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await uploadFile(data);
      await get().fetchFiles();
      return res;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Upload failed";
      set({ error: message, loading: false });
      throw err;
    }
  },

  update: async (shareId, data) => {
    set({ loading: true, error: null });
    try {
      const res = await updateFile(shareId, data);
      const updated = get().files.map((f) =>
        f.shareId === shareId ? { ...f, title: res.title } : f
      );
      set({ files: updated, loading: false });
      return res;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Update failed";
      set({ error: message, loading: false });
      throw err;
    }
  },

  remove: async (shareId) => {
    set({ loading: true, error: null });
    try {
      await apiDeleteFile(shareId);
      const updated = get().files.filter((f) => f.shareId !== shareId);
      set({ files: updated, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Delete failed";
      set({ error: message, loading: false });
      throw err;
    }
  },

}));
