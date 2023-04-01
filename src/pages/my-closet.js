import { useState } from 'react';
import { clothes } from '../lib/clothes';
import { DndContext } from '@dnd-kit/core';
import Droppable from '../components/Droppable';
import Draggable from '../components/Draggable';
import { useEffect } from 'react';


export default function MyCloset() {
    const [closet, setCloset] = useState([]);

    useEffect(() => {
        console.log(closet);
    }, [closet])

    const draggableMarkup = (
        <>
            <h2>아우터</h2>
            {clothes
                .filter((cloth) => (cloth.category === '아우터'))
                .map((cloth) => (
                    <Draggable id={cloth.id} name={cloth.name}>{cloth.name}</Draggable>
                ))
            }
            <h2>상의</h2>
            {clothes
                .filter((cloth) => (cloth.category === '상의'))
                .map((cloth) => (
                    <Draggable id={cloth.id} name={cloth.name}>{cloth.name}</Draggable>
                ))
            }
            <h2>하의</h2>
            {clothes
                .filter((cloth) => (cloth.category === '하의'))
                .map((cloth) => (
                    <Draggable id={cloth.id} name={cloth.name}>{cloth.name}</Draggable>
                ))
            }
            <h2>원피스</h2>
            {clothes
                .filter((cloth) => (cloth.category === '원피스'))
                .map((cloth) => (
                    <Draggable id={cloth.id} name={cloth.name}>{cloth.name}</Draggable>
                ))
            }
            <h2>기타</h2>
            {clothes
                .filter((cloth) => (cloth.category === '기타'))
                .map((cloth) => (
                    <Draggable id={cloth.id} name={cloth.name}>{cloth.name}</Draggable>
                ))
            }
        </>
    );

    function handleDragEnd(event) {
        const { over, active } = event;
        console.log(event)
        if (over) {
            if (closet.includes(active.data.current.name)) {
                alert("이미 옷장에 존재하는 옷이에요.");
                return;
            }
            setCloset([...closet, active.data.current.name]);
        }

        // If the item is dropped over a container, set it as the parent
        // otherwise reset the parent to `null`
        //setParent(over ? over.id : null);
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            {draggableMarkup}
            <Droppable id='droppable' closet={closet}>
                Drop here
            </Droppable>
        </DndContext>
    )
}