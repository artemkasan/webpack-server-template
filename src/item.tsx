import * as React from "react";
import classNames from "classnames";

import Button from "@material-ui/core/Button";

import * as itemCss from "./item.scss";

export function delay(time:number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
}

const expandTime: number = 150;

export interface IItemProps {
	id: number;
	index: number;
	title: string;
	description: string;
	selected: boolean;
	expanded: boolean;
	onClick: (id:number) => void;
	onRowHeightChanged: (id: number, height: number) => void;
}

export interface IItemState {
	expanded: boolean;
	unexpanding: boolean;
	expanding: boolean;
}

interface IDetailsProps {
	description: string;
}

class Details extends React.PureComponent<IDetailsProps> {
	render(): JSX.Element {
		return <div>
			<div className={itemCss.description}>{this.props.description}</div>
			<div className={itemCss.buttonsContainer}>
				<Button>Load</Button>
				<Button>Save</Button>
			</div>
		</div>;
	}
}

export class Item extends React.PureComponent<IItemProps, IItemState> {
	private heightContainer: React.RefObject<HTMLDivElement>;
	constructor(props: IItemProps) {
		super(props);
		this.state = {
			expanded: props.expanded,
			unexpanding: false,
			expanding: false
		};

		this.heightContainer = React.createRef();
	}

	private bind = {
		click: () => this.props.onClick(this.props.id),
	};

	async componentDidUpdate(prevProps: Readonly<IItemProps>, prevState: Readonly<IItemState>): Promise<void> {
		if(!this.props.expanded && prevProps.expanded) {
			this.setState({
				expanded:false,
				unexpanding: true
			});
			await delay(expandTime);
			this.setState({
				unexpanding: false
			});
		}
		if(this.props.expanded && !prevProps.expanded) {
			await delay(10);
			this.setState({
				expanding: true
			});
			await delay(expandTime);
			this.setState({
				expanded: true,
				expanding: false
			});
		}

		if(this.heightContainer.current != null) {
			this.props.onRowHeightChanged(this.props.index, this.heightContainer.current.clientHeight);
		}
	}

	render(): JSX.Element {

		let height: string = "0";
		if(this.props.expanded) {
			if(this.heightContainer.current != null) {
			height = `${this.heightContainer.current.clientHeight}px`;
			} else {
				height = "54px";
			}
		}

		return <div
			className={classNames(
				itemCss.itemContainer,
				this.props.selected && itemCss.selected,
				this.state.expanded && itemCss.expanded,
				this.state.expanding && itemCss.expanding,
				this.state.unexpanding && itemCss.unexpanding) }
			onClick={this.bind.click}>
			<div className={itemCss.title}>{this.props.title}</div>
			<div className={itemCss.body} style={{height: height}}>
				<div ref={this.heightContainer}>
					{(this.props.expanded || this.state.unexpanding) && <Details description={this.props.description}/> }
				</div>
			</div>
		</div>;
	}
}