import React from "react";
import { Button } from "@material-ui/core"
import { Link } from 'react-router-dom';

function RouterLinkButton(props) {
    const { className, variant, size, color, href, to } = props;

    return (
        <Button
            component={Link}
            className={className}
            variant={variant}
            size={size}
            color={color}
            to={to}
            href={href}
        >
            {props.children}
        </Button>
    )
}

export default RouterLinkButton;