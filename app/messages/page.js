import Messages from '@/components/messages';
import { getMessages } from '@/lib/messages';
import { revalidatePath, unstable_noStore } from 'next/cache';


export const revalidate = 5 //nextjs 앱 라우터 환경에서 전체 설정 => 5초 마다 캐시 재생성
export const dynamic = 'force-dynamic'; //'auto' => 기본설정 nextjs 앱 라우터 환경에서 전체 설정 => 캐시 사용 안함

export default async function MessagesPage() {
  unstable_noStore(); //=> nextjs에서 제공하는 캐시 사용 안함 기능
  revalidatePath('/'); //=> 캐시를 비활성화 하는 것이 아닌 재검증으로 캐시방지
  const response = await fetch('http://localhost:8080/messages', {
    headers: {
      'X-ID': 'page',
    },

    cache: 'no-store', // 캐시 사용 안함
    next: {
      revalidate: 5, //5초 마다 캐시 재생성
      tags: ['msg'] // revalidateTag('msg'); msg에 대해 캐시방지
    }
  });

  // const messages = getMessages();

  const messages = await response.json();

  if (!messages || messages.length === 0) {
    return <p>No messages found</p>;
  }

  return <Messages messages={messages} />;
}
