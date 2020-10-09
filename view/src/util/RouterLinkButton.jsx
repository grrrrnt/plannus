import React from "react";
import { Button } from "@material-ui/core"
import { NavLink } from 'react-router-dom';

function RouterLinkButton(props) {
    const { className, variant, size, color, href, to, activeClassName } = props;

    return (
        <Button
            component={NavLink}
            className={className}
            variant={variant}
            size={size}
            color={color}
            href={href}
            to={to}
            activeClassName={activeClassName}
            exact="true"
        >
            {props.children}
        </Button>
    )
}

export default RouterLinkButton;