'use client';

import Image from 'next/image';
import Chat from './components/Chat';

export default function Home() {
  return (
    <main className="App">
      <div className='container'>
        <div className='logoBox'>
          <Image  src="/task-wizard-logo.png"  alt="Task Wizard Icon Logo" width="200" height="150" />
          <p>This is an interface to talk to the Task Wizard. Let him organize your tasks for the day!</p>
        </div>
        <Chat />
      </div>
    </main>
  )
}
