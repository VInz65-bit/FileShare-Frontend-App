import axios from "axios";
import type {
  AuthResponseDTO,
  FileDetailsDTO,
  FileResponseDTO,
  FileUploadRequest,
  UserRequestDTO,
  UserResponseDTO,
} from "@/types";
import { LocalFile } from "@/store/file-store";

const API_BASE = "/proxy";

const api = axios.create({
  baseURL: API_BASE,
});

// ─── Local Mocking System ──────────────────────────────────
const MOCK_FILES_KEY = "mock_files_v1";

function getMockFiles(): FileDetailsDTO[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(MOCK_FILES_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveMockFiles(files: FileDetailsDTO[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MOCK_FILES_KEY, JSON.stringify(files));
}

// ─── helpers ─────────────────────────────────────────────────
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function getUsername(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("username");
}

function authHeaders() {
  const token = getToken();
  const username = getUsername();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (username) headers["X-Logged-In-User"] = username;
  return headers;
}

// ─── Auth ────────────────────────────────────────────────────
export async function registerUser(
  data: UserRequestDTO
): Promise<UserResponseDTO> {
  const res = await api.post<UserResponseDTO>("/api/v1/users", data);
  return res.data;
}

export async function loginUser(
  data: Pick<UserRequestDTO, "username" | "password">
): Promise<AuthResponseDTO> {
  const res = await api.post<AuthResponseDTO>("/api/v1/users/login", data);
  return res.data;
}



// ─── Files ───────────────────────────────────────────────────
export async function uploadFile(
  data: FileUploadRequest
): Promise<FileResponseDTO> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const shareId = Math.random().toString(36).substring(7);
  const newFile: FileDetailsDTO = {
    shareId,
    title: data.title,
    description: data.description,
    fileType: data.file.type,
    owner: getUsername() || "Guest User",
    previewUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60",
    fileSize: data.file.size,
  };

  const files = getMockFiles();
  saveMockFiles([...files, newFile]);

  return {
    message: "File uploaded successfully (Local Mock)",
    shareId,
    title: data.title,
  };
}

export async function updateFile(
  shareId: string,
  data: FileUploadRequest
): Promise<FileResponseDTO> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const files = getMockFiles();
  const index = files.findIndex((f) => f.shareId === shareId);
  
  if (index === -1) {
    throw new Error("File not found");
  }

  files[index] = {
    ...files[index],
    title: data.title,
    description: data.description,
  };

  saveMockFiles(files);

  return {
    message: "File updated successfully (Local Mock)",
    shareId,
    title: data.title,
  };
}

export async function deleteFile(shareId: string): Promise<FileResponseDTO> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const files = getMockFiles();
  const filtered = files.filter((f) => f.shareId !== shareId);
  saveMockFiles(filtered);

  return {
    message: "File deleted successfully (Local Mock)",
    shareId,
    title: "Deleted",
  };
}

export async function getFileDetails(
  shareId: string
): Promise<FileDetailsDTO> {
  const files = getMockFiles();
  const file = files.find((f) => f.shareId === shareId);
  if (!file) throw new Error("File not found");
  return file;
}

export function getPreviewUrl(shareId: string, download = false): string {
  // For mock, just return a generic preview
  return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60";
}

export async function getMyFiles(): Promise<FileDetailsDTO[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return getMockFiles();
}


