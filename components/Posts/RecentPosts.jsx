import React, {useEffect, useState} from 'react'
import { db } from "../../firebase-config";
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Image from 'next/image';
import moment from 'moment';



const RecentPosts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const collectionRef = collection(db, 'posts');
        const q = query(collectionRef, orderBy('timestamp', 'desc'))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setPosts(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, timestamp:doc.data().timestamp?.toDate().getTime() })));
        })

        return () => unsubscribe();
    }, []);

  return (
    <>
      
      <div className="min-h-full">
        <div className="py-10">
          <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 ">
            
            <main className="lg:col-span-9 xl:col-span-6">
              
              <div className="mt-4">
                <h1 className="sr-only">Recent posts</h1>
                <ul role="list" className="space-y-4">
                  {posts.map((post) => (
                    <li key={post.id} className="bg-white px-4 py-6 shadow sm:p-6 sm:rounded-lg">
                      <article aria-labelledby={'post-title-' + post.id}>
                        <div>
                          <h2 id={'post-title-' + post.id} className="mt-4 text-base font-medium text-gray-900">
                            {post.post}
                          </h2>

                          <div className="flex space-x-3">       
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-gray-500">
                                <a href={post.href} className="hover:underline">
                                  <time dateTime={post.datetime}>{moment(post.timestamp).fromNow()}</time>
                                </a>
                              </p>
                            </div>
                          </div>


                        </div>
                        
                      </article>
                    </li>
                  ))}
                </ul>
              </div>
            </main>

          </div>
        </div>
      </div>
    </>
  )
}

export default RecentPosts;