export interface Task {
    task_id: number;
    title: string;
    description?: string;
    completed: boolean;
    created_at: string;
    list_id: number;
}