export interface Task {
    task_id: string;
    user_id: string;
    title: string;
    description?: string;
    completed: boolean;
    created_at: string;
    list_id?: string;
    due_date?: string;
}