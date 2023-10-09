import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { Grid } from "./Grid";
import * as React from "react";

export class DetailsList implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;

    constructor() { }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        return React.createElement(Grid, { selectedGroups: ["location", "shape", "color"] });
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
    }
}
