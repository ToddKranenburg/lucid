import React from 'react';
import PropTypes from 'react-peek/prop-types';
import ReactDOM from 'react-dom';
import { createClass, omitProps } from '../../util/component-types';
import { lucidClassNames } from '../../util/style-helpers';

const cx = lucidClassNames.bind('&-Portal');

const { any, node, string } = PropTypes;

const Portal = createClass({
	displayName: 'Portal',

	statics: {
		peek: {
			description: `
				A Portal component is used to render content in a container that is
				appended to \`document.body\`.
			`,
			categories: ['utility'],
		},
	},

	propTypes: {
		children: node`
			any valid React children
		`,
		className: any`
			Appended to the component-specific class names set on the root element.
			Value is run through the \`classnames\` library.
		`,

		portalId: string.isRequired`
			The \`id\` of the portal element that is appended to \`document.body\`.
		`,
	},
	render: () => null,
	componentDidMount() {
		const { portalId } = this.props;

		let portalElement = window.document.getElementById(portalId);
		if (!portalElement) {
			portalElement = window.document.createElement('div');
			portalElement.id = portalId;
			window.document.body.appendChild(portalElement);
		}
		this.portalElement = portalElement;
		this.componentDidUpdate();
	},
	componentWillUnmount() {
		window.document.body.removeChild(this.portalElement);
	},
	componentDidUpdate() {
		ReactDOM.render(
			<div
				{...omitProps(this.props, Portal)}
				className={cx('&', this.props.className)}
			>
				{this.props.children}
			</div>,
			this.portalElement
		);
	},
});

export default Portal;
