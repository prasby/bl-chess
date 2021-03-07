import React, { useEffect, useMemo, useRef } from "react";
import { useHandler } from "react-use-handler";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { BOARD_SIZE, Coordinate, figuresToIcons } from "src/data/game/domain";
import { CELL_SIZE, LEGEND_SIZE, scaleValue, Theme } from "src/utils/scale";
import { useTheme } from "styled-components";
import * as Styles from "./Figure.styles";

interface FigureProps extends Coordinate {
    cell: string;
    enabled: boolean;
    reverseBoard: boolean;
    onSuggestRequest(from: Coordinate): void;
    onMotionRequest(from: Coordinate, to: Coordinate): boolean;
}

const useDragHandler = (
    startCoord: { x: number; y: number },
    positions: { x: BehaviorSubject<number>; y: BehaviorSubject<number>, zIndex: BehaviorSubject<number> },
    onMotionRequest: (from: Coordinate, to: Coordinate) => boolean,
    onSuggestRequest: (from: Coordinate) => void,
    reverse: boolean,
) => {
    const isDown = useRef<boolean>(false);
    const movePosition = useRef<Coordinate>({ x: 0, y: 0});
    const theme = useTheme() as Theme;
    const toLocal = (value: number) => {
        const legend = scaleValue(theme, LEGEND_SIZE);
        const cell = scaleValue(theme, CELL_SIZE);
        const position = (value - legend) / cell;
        return reverse ? BOARD_SIZE - position : position;
    }
    const coordToLocal = (coordinate: Coordinate) => {
        return {
            x: toLocal(coordinate.x),
            y: toLocal(coordinate.y),
        }
    }
    const align = useHandler((e: MouseEvent) => {
        const motionX = toLocal(e.clientX);
        const motionY = toLocal(e.clientY);
        movePosition.current = {
            x: Math.floor(motionX),
            y: Math.floor(motionY),
        }
        positions.x.next(motionX - 0.5);
        positions.y.next(motionY - 0.5);
    });
    useEffect(() => {
        const setMouseUp = () => {
            if (isDown.current) {
                isDown.current = false;
                positions.zIndex.next(0);
                if (!onMotionRequest(startCoord, movePosition.current)) {
                    positions.x.next(startCoord.x);
                    positions.y.next(startCoord.y);
                }
            }
        };
        const move = (e: MouseEvent) => {
            if (isDown.current) {
                align(e);
            }
        };
        document.addEventListener("mouseup", setMouseUp);
        document.addEventListener("mousemove", move);
        return () => {
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup", setMouseUp);
        }
    }, [startCoord]);
    return useHandler((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        onSuggestRequest(startCoord);
        isDown.current = true;
        align(event.nativeEvent);
        positions.zIndex.next(1000);
        movePosition.current = {
            x: Math.floor(startCoord.x),
            y: Math.floor(startCoord.y),
        }
    });
};

export interface FigureRendererProps extends React.HTMLAttributes<HTMLElement> {
    white: boolean;
    enabled: boolean;
    cell: string;
}

export const FigureRenderer = ({
    white,
    enabled,
    cell,
    ...rest
}: FigureRendererProps) => {
    return (
        <Styles.Figure
            {...rest}
            white={white}
            enabled={enabled}
        >
            <Styles.FigureIcon white={white}>
                {figuresToIcons[cell.split("-")[0]]}
            </Styles.FigureIcon>
        </Styles.Figure>
    );
};

export const FigureComponent = ({ reverseBoard, x, y, enabled, cell, onMotionRequest, onSuggestRequest }: FigureProps) => {
    const white = (cell as string).charAt(0) === "w";
    const positions = useMemo(() => ({
        x: new BehaviorSubject(x),
        y: new BehaviorSubject(y),
        zIndex: new BehaviorSubject(0),
    }), []);
    useEffect(() => {
        positions.x.next(x);
        positions.y.next(y);
    }, [x, y]);
    const coordinates = useMemo(() => ({ x, y }), [x, y]);
    const onMouseDown = useDragHandler(coordinates, positions, onMotionRequest, onSuggestRequest, reverseBoard);
    const theme = useTheme() as Theme;
    const actualScaleSize = scaleValue(theme, CELL_SIZE);
    const displayPosition = (value: Observable<number>, reverse: boolean) => {
        return value.pipe(map(v => {
            const c = reverse ? BOARD_SIZE - 1 - v : v;
            return `${c * actualScaleSize}px`;
        }));
    };
    return (
        <Styles.FigureContainer
            style={{
                top: displayPosition(positions.y, reverseBoard),
                left: displayPosition(positions.x, reverseBoard),
                zIndex: positions.zIndex,
            }}
            onMouseDown={onMouseDown}
        >
            <FigureRenderer
                white={white}
                enabled={enabled}
                cell={cell}
            />
        </Styles.FigureContainer>
    );
};