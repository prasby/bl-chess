import React from "react";
import { getSide } from "src/data/game/domain";
import { FigureRenderer } from "../Figure/Figure";
import * as Styles from "./SelectFigure.styles";

interface Props {
    selectingFigures: string[];
    onFigureSelected(id: string): void;
}

export const SelectFigureComponent = ({ selectingFigures, onFigureSelected }: Props) => {
    return (
        <Styles.Container>
            {selectingFigures.map((figureId) => (
                <FigureRenderer
                    onClick={() => { onFigureSelected(figureId); }}
                    key={figureId}
                    white={getSide(figureId) === "w"}
                    enabled
                    cell={figureId}
                />
            ))}
        </Styles.Container>
    )
};