import { createSignal, For, onMount } from "solid-js";
import { A } from "solid-start";
import CreateTaskModal from "~/components/CreateTaskModal";
import TaskCard from "~/components/TaskCard";
import { Position, Project, Task } from "~/services/domain";
import {
  getActiveProject,
  getProjectTasks,
  onTaskAdded,
  saveTask,
} from "~/services/service";

export default function Home() {
  const [todos, setTodos] = createSignal([] as Task[]);
  const [position, setPosition] = createSignal({} as Position);
  const [project, setProject] = createSignal({} as Project);
  const [isCreateModal, setIsCreateModal] = createSignal(false);

  onMount(async () => {
    const project = await getActiveProject();
    setProject(project);
    setTodos(await getProjectTasks(project.id));
    onTaskAdded((task: Task) => {
      if (!todos().find((it) => it.id === task.id)) {
        setTodos([task, ...todos()]);
      }
    });
  });

  const showModal = (ev: MouseEvent) => {
    const { clientX, clientY } = ev;
    setPosition({ x: clientX, y: clientY });
    setIsCreateModal(true);
  };

  async function saveTodo(name: string, description: string) {
    const task = await saveTask(project(), name, description, position());
    setTodos([task, ...todos()]);
  }

  return (
    <main onClick={showModal}>
      {todos().length === 0 && (
        <h1>Click anywhere on the canvas to add your tasks.</h1>
      )}
      {todos().length > 0 && (
        <For each={todos()}>{(task) => <TaskCard task={task} />}</For>
      )}
      {isCreateModal() && (
        <CreateTaskModal
          onClose={() => setIsCreateModal(false)}
          onSave={saveTodo}
        />
      )}
    </main>
  );
}
