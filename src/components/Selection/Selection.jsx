import _ from 'lodash';
import React from 'react';
import PropTypes from 'react-peek/prop-types';
import MinusCircleIcon from '../Icon/MinusCircleIcon/MinusCircleIcon';
import SuccessIcon from '../Icon/SuccessIcon/SuccessIcon';
import CrossIcon from '../Icon/CrossIcon/CrossIcon';
import InfoIcon from '../Icon/InfoIcon/InfoIcon';
import WarningIcon from '../Icon/WarningIcon/WarningIcon';
import { lucidClassNames } from '../../util/style-helpers';
import {
	createClass,
	omitProps,
	getFirst,
	filterTypes,
	rejectTypes,
} from '../../util/component-types';

const { createElement } = React;

const { bool, func, string, node, oneOf } = PropTypes;

const cx = lucidClassNames.bind('&-Selection');

const responsiveMap = {
	small: 'small',
	medium: 'small',
	large: 'large',
};

function defaultIcon(kind, responsiveMode) {
	return kind === 'default'
		? null
		: kind === 'container'
				? null
				: kind === 'success'
						? <SuccessIcon
								className={cx('&-Icon', `&-Icon-is-${responsiveMode}`)}
							/>
						: kind === 'danger'
								? <MinusCircleIcon
										className={cx('&-Icon', `&-Icon-is-${responsiveMode}`)}
									/>
								: kind === 'info'
										? <InfoIcon
												className={cx('&-Icon', `&-Icon-is-${responsiveMode}`)}
											/>
										: kind === 'warning'
												? <WarningIcon
														className={cx(
															'&-Icon',
															`&-Icon-is-${responsiveMode}`
														)}
													/>
												: null;
}

const Selection = createClass({
	displayName: 'Selection',

	statics: {
		peek: {
			description: `
				Used to indicate selections. It's very similar to \`Tag\` but is meant
				to be used in areas of the UI that have more space available to them.
			`,
			categories: ['communication'],
		},
	},

	components: {
		Label: createClass({
			displayName: 'Selection.Label',
			propName: 'Label',
		}),

		Icon: createClass({
			displayName: 'Selection.Icon',
			propName: 'Icon',
		}),
	},

	propTypes: {
		className: string`
			Appended to the component-specific class names set on the root element.
		`,

		kind: oneOf([
			'default',
			'container',
			'success',
			'danger',
			'info',
			'warning',
		])`
			Applies an icon and styles for the kind of selection.
		`,

		isRemovable: bool`
			Shows or hides the little "x" for a given item.
		`,

		hasBackground: bool`
			Gives the selection a background. This is desirable when you only have
			one level of nested selections.
		`,

		isBold: bool`
			Make the content text bold. This is desirable when you only have one
			level of nested selections.
		`,

		onRemove: func`
			Called when the close button is clicked.  Signature:
			\`({ props, event }) => {}\`
		`,

		Label: node`
			Label of the component.
		`,

		Icon: node`
			Display a custom icon for the selection. Generally you shouldn't need
			this prop since the \`kind\` prop will pick the correct icon for you.
		`,

		children: node`
			Arbitrary children.
		`,

		responsiveMode: oneOf(['small', 'medium', 'large'])`
			Adjusts the display of this component. This should typically be driven by
			screen size. Currently \`small\` and \`large\` are explicitly handled by
			this component.
		`,
	},

	getDefaultProps() {
		return {
			kind: 'default',
			isRemovable: true,
			onRemove: _.noop,
			hasBackground: false,
			isBold: false,
			responsiveMode: 'large',
		};
	},

	handleRemove(event) {
		this.props.onRemove({ props: this.props, event });
	},

	render() {
		const {
			className,
			kind,
			isRemovable,
			children,
			hasBackground,
			isBold,
			responsiveMode: responsiveModeInput,
			...passThroughs
		} = this.props;

		const responsiveMode = responsiveMap[responsiveModeInput];
		const isSmall = responsiveMode === 'small';

		const selectionChildren = filterTypes(children, Selection);
		const otherChildren = rejectTypes(children, Selection);
		const labelProps = _.get(
			getFirst(this.props, Selection.Label),
			'props',
			{}
		);
		const iconElement = getFirst(this.props, Selection.Icon);
		const iconChildren = _.get(iconElement, 'props.children');
		const icon = iconChildren
			? createElement(iconChildren.type, {
					...iconChildren.props,
					className: cx('&-Icon', iconChildren.props.className),
				})
			: defaultIcon(kind, responsiveMode);

		return (
			<div
				{...omitProps(passThroughs, Selection)}
				className={cx(
					'&',
					`&-is-${responsiveMode}`,
					kind && `&-${kind}`,
					{
						'&-has-background': hasBackground,
						'&-is-bold': isBold,
					},
					className
				)}
			>
				{icon}

				<div className={cx('&-content')}>
					<div className={cx('&-label-container')}>
						<span
							{...labelProps}
							className={cx('&-label', isSmall && '&-label-is-small')}
						/>

						{isRemovable
							? <CrossIcon
									isClickable
									size={isSmall ? 44 : 26}
									viewBox={isSmall ? '-6 -6 28 28' : '-3 -2 20 20'}
									className={cx('&-close-button')}
									onClick={this.handleRemove}
								/>
							: null}
					</div>

					{_.isEmpty(selectionChildren)
						? null
						: <div className={cx('&-children-container')}>
								{_.map(selectionChildren, ({ props }, i) => (
									<Selection
										key={
											_.get(
												getFirst(props, Selection.Label),
												['props', 'children'],
												{}
											) + i
										}
										{...props}
									/>
								))}
							</div>}
					{otherChildren}

				</div>
			</div>
		);
	},
});

export default Selection;
