import * as faces from 'facesjs';
import React, { useEffect, useRef } from 'react';
import type { Player } from '../../common/types';

interface PlayerPictureProps {
    face?: Player['face'];
    imgURL?: string;
}

const PlayerPicture: React.FC<PlayerPictureProps> = ({ face, imgURL }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (wrapperRef.current && face) {
            const faceConfig = {
                ...face,
                fatness: 0.5,
                teamColors: ['#000000', '#ffffff', '#000000'] as [string, string, string],
                hairBg: { id: 'none' },
                body: {
                    id: 'body1',
                    color: face.colors.skinColor,
                    size: 1
                },
                eyes: [{
                    angle: 0,
                    color: '#000000'
                }, {
                    angle: 0,
                    color: '#000000'
                }],
                hair: {
                    id: 'hair1',
                    color: face.colors.hairColor,
                    flip: false
                },
                head: {
                    id: 'head1',
                    shave: 'none'
                },
                mouth: {
                    id: 'mouth1',
                    flip: false
                },
                nose: {
                    id: 'nose1',
                    flip: false,
                    size: 1
                },
                ear: {
                    id: 'ear1',
                    size: 1
                },
                eyebrow: {
                    id: 'eyebrow1',
                    angle: 0
                },
                glasses: {
                    id: 'glasses1',
                    color: '#000000'
                },
                jersey: {
                    id: 'jersey1',
                    color: '#000000'
                },
                eyeLine: {
                    id: 'eyeLine1',
                    color: '#000000'
                },
                smileLine: {
                    id: 'smileLine1',
                    size: 1
                },
                miscLine: {
                    id: 'miscLine1',
                    color: '#000000'
                },
                jerseyNumber: {
                    color: '#ffffff'
                },
                jerseyText: {
                    color: '#ffffff'
                },
                jerseyTextOutline: {
                    color: '#000000'
                },
                facialHair: {
                    id: 'facialHair1',
                    color: '#000000'
                },
                eye: {
                    id: 'eye1',
                    angle: 0
                },
                accessories: {
                    id: 'accessories1',
                    color: '#000000'
                }
            };
            faces.display(wrapperRef.current, faceConfig);
        }
    }, [face]);

    if (imgURL) {
        return <img
            alt="Player"
            src={imgURL}
            style={{maxHeight: '100%', maxWidth: '100%'}}
        />;
    }

    if (face) {
        return <div ref={wrapperRef} />;
    }

    return <div />;
};

export default PlayerPicture;
