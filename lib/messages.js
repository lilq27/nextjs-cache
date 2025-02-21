import sql from 'better-sqlite3';
import { unstable_cache as nextCache} from 'next/cache';
import { cache } from 'react';

const db = new sql('messages.db');

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY, 
      text TEXT
    )`);
}

initDb();

export function addMessage(message) {
  db.prepare('INSERT INTO messages (text) VALUES (?)').run(message);
}

//cache => 동일한 호출에 대해, DB를 다시 호출하지 않고 캐싱된 값을 반환 => 중복호출 방지
export const getMessages = nextCache(
  cache( function getMessages() {
    console.log('Fetching messages from db');
    return db.prepare('SELECT * FROM messages').all(); 
  }),
  ['messages'], //revalidatePath('/messages'); //=> 캐시를 비활성화 하는 것이 아닌 재검증으로 캐시방지
  {
    revalidate: 5, //5초 마다 캐시 재생성
    tags: ['msg'], //revalidateTag('msg'); msg에 대해 캐시방지
  }
);
