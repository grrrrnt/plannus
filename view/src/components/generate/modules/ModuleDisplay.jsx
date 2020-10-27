import React, { Component } from "react";
import Module from './Module';
import LazyLoad from 'react-lazyload';
/*
class ModuleDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modules: this.props.modules,
        };
    }

    render() {
        var { modules } = this.state;

        return (
            <div>
            {
                modules.map(m => {
                    return (
                        <Module key={m.moduleCode} moduleCode={m.moduleCode} title={m.title} />
                    )
                })
            }
            </div>
        );
    }
}
*/

const Loading = () => (
    <div> loading ...</div>
);

const ModuleDisplay = ({ modules }) => {
    return (
        <div>
        {
            modules.map(m => {
                return (
                    <LazyLoad key={m.moduleCode} placeholder={<Loading />} offset = {100} height = {200}>
                    <Module key={m.moduleCode} moduleCode={m.moduleCode} title={m.title} />
                    </LazyLoad>
                )
            })
        }
        </div>
    );
}

export default ModuleDisplay