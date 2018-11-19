import * as React from "react";
import { Item, IItemProps } from "./item";
import { Index, ListRowProps } from "react-virtualized";
import { List as VirtualList } from "react-virtualized/dist/commonjs/List";
import { AutoSizer } from "react-virtualized/dist/commonjs/AutoSizer";
import "react-virtualized/styles.css";

import * as listCss from "./list.scss";

export interface IListProps {

}

type ItemType = Pick<IItemProps, "id"|"title"| "description"| "selected"| "expanded"> & {size: number | null};

export interface IListState {
	items: ItemType[];
}

export class List extends React.Component<IListProps, IListState> {
	public constructor(props: IListProps) {
		super(props);
		this.state = {
			items: [
				{id: 1, title: "Hello world", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, \
				 sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud \
				  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit \
				   in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non \
				   proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", selected: false, expanded: false, size: null},
				{id: 2, title: "Hello world1", description: "This is first item1", selected: true, expanded: true, size: null},
				{id: 3, title: "Hello world2", description: "This is first item2", selected: true, expanded: false, size: null},
				{id: 4, title: "Hello world3", description: "This is first item3", selected: true, expanded: false, size: null},
				{id: 5, title: "Hello world4", description: "This is first item4", selected: false, expanded: false, size: null},
				{id: 6, title: "Hello world5", description: "This is first item5", selected: false, expanded: false, size: null},
				{id: 7, title: "Hello world6", description: "This is first item6", selected: false, expanded: false, size: null},
				{id: 8, title: "Hello world5", description: "This is first item5", selected: false, expanded: false, size: null},
				{id: 9, title: "Hello world6", description: "This is first item6", selected: false, expanded: false, size: null},
				{id: 10, title: "Hello world10", description: "This is first item10", selected: false, expanded: false, size: null},
				{id: 11, title: "Hello world11", description: "This is first item11", selected: false, expanded: false, size: null},
			]
		};
	}

	private bind = {
		click: (id: number)=> this.click(id),
		onRowHeightChanged: (id: number, height: number) => this.onRowHeightChanged(id, height),
		getRowHeight: (index: Index) => this._getRowHeight(index),
		noRowsRenderer: () => this._noRowsRenderer(),
		rowRenderer: (props: ListRowProps) => this._rowRenderer(props)
	};

	render(): JSX.Element {
		return <AutoSizer disableHeight>
		{({width}) => (
			<VirtualList
			  ref="List"
			  height={300}
			  overscanRowCount={10}
			  noRowsRenderer={this._noRowsRenderer}
			  rowCount={1000}
			  rowHeight={ this.bind.getRowHeight}
			  rowRenderer={this.bind.rowRenderer}
			  width={width}
			/>
		  )}
		</AutoSizer>;


		// return <div className={listCss.listContainer} style={{height: "300px", minHeight: 0}}>
		// 	<div className={listCss.itemsArea}>
		// 		{this.state.items.map(x =>
		// 			<Item
		// 				key={x.id}
		// 				id={x.id}
		// 				title={x.title}
		// 				description={x.description}
		// 				selected={x.selected}
		// 				expanded={x.expanded}
		// 				onClick={this.bind.click} />)}
		// 	</div>
		// 	<div className={listCss.scrollShift} style={{top: "1000px"}}/>
		// </div>;
	}
	private _getDatum(index: number): ItemType {
		return this.state.items[index %  this.state.items.length];
	}

	private _getRowHeight(index: Index): number {
		return this._getDatum(index.index).size;
	}

	private _noRowsRenderer(): JSX.Element {
		return <div >No rows</div>;
	}

	private _rowRenderer(props: ListRowProps): JSX.Element {
		if (props.isScrolling) {
		  return (
			<div
			  key={props.key}
			  style={props.style}>
			  Scrolling...
			</div>
		  );
		}

		const datum: ItemType = this._getDatum(props.index);

		return <Item
				key={datum.id}
				index={ props.index}
				id={datum.id}
				title={datum.title}
				description={datum.description}
				selected={datum.selected}
				expanded={datum.expanded}
				onClick={this.bind.click}
				onRowHeightChanged={this.bind.onRowHeightChanged} />;
	}

	private click(id: number): void {

		let items: IListState["items"] = this.state.items;
		items.forEach(element => {
			element.expanded = (element.id === id);
		});
		this.setState({
			items: items
		});
	}

	private onRowHeightChanged(id: number, height: number): void {
		const datum: ItemType = this._getDatum(id);
		datum.size = height;
	}
}