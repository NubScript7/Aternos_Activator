import { setTimeout } from 'timers/promises';

export async function wait(seconds: number) {
  await setTimeout(seconds);
}
