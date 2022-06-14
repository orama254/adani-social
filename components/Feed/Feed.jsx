import React from 'react'
import { AddPostComponent, RecentPostComponent } from '../Posts';
import { db, storage } from '../../firebase-config';

const Feed = () => {

    console.log('The Database===>', db);
    console.log('The Storage===>', storage);

  return (
    <>
    <div 
    className='flex flex-col items-center justify-center'
    >

    <div>Adani-social</div>
    <AddPostComponent />
    <RecentPostComponent />
    </div>
    </>
  )
}



export default Feed;