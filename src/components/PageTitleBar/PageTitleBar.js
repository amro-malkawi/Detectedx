/**
 * Page Title Bar Component
 * Used To Display Page Title & Breadcrumbs
 */
import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';

const PageTitleBar = ({ title, match }) => {
    return (
        <div className="page-title d-flex justify-content-between align-items-center">
            {title &&
                <div className="page-title-wrap">
                    <h2 className="text-primary">{title}</h2>
                </div>
            }
        </div>
    )
};

// default props value
PageTitleBar.defaultProps = {
}

export default PageTitleBar;
