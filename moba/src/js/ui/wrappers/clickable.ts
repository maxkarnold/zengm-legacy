import React, { useState, useCallback } from 'react';

interface ClickableProps {
    toggleClicked: (event: React.MouseEvent) => void;
    clicked: boolean;
}

export default function withClickable<P extends object>(
    WrappedComponent: React.ComponentType<P & ClickableProps>
): React.FC<P> {
    return function ClickableWrapper(props: P) {
        const [clicked, setClicked] = useState(false);

        const toggleClicked = useCallback((event: React.MouseEvent) => {
            // Don't toggle the row if a link was clicked
            const ignoredElements = ['A', 'BUTTON', 'INPUT', 'SELECT'];
            if (event.target instanceof HTMLElement) {
                if (ignoredElements.includes(event.target.nodeName)) {
                    return;
                }
                if (event.target.dataset?.noRowHighlight) {
                    return;
                }
            }

            setClicked(prev => !prev);
        }, []);

        const componentProps = {
            ...props,
            clicked,
            toggleClicked
        } as P & ClickableProps;

        return React.createElement(WrappedComponent, componentProps);
    };
}
