import { useDroppable } from '@dnd-kit/core';

export default function Droppable(props) {
    const { isOver, setNodeRef } = useDroppable({
        id: props.id,
    });

    const style = {
        color: isOver ? 'green' : undefined,

    };

    return (
        <>
            <div ref={setNodeRef} style={style}>
                {props.children}

                <style jsx>{`
                div {
                    border: dashed 1px black;
                }
            `}</style>
            </div>
            <div>
                {props.closet
                    .map((cloth) => (
                        <li>{cloth}</li>
                    ))}

            </div>

        </>
    );

}