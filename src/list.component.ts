import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { State, SortMode } from './list-utils'

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit 
{
  @Input('items') items: any[] = [];
  @Input('schema') schema: any = {};
  @Input('state') state: State = State.List;
  @Input('error') error: string;
  @Input('flow') flow :  boolean=false;
  @Input('header-on-empty') headerOnEmpty: boolean = false;
  @Input('max-height') maxHeight: string = "100%";
  @Input('min-width') minWidth: string = "200px";

  @Output('item-click') clickEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output('item-dbl-click') dblClickEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output('on-sort') sortEmitter: EventEmitter<any> = new EventEmitter<any>();

  private activeItem:any = null;

  constructor() { }

  ngOnInit() {}

  itemClass(item:any): string
  {
    return item == this.activeItem? "active-list-item":"";
  }

  onItemClick(event:any, item:any): void
  {
    if(event.ctrlKey)
      this.activeItem = null;
    else
      this.activeItem = item;

    this.clickEmitter.emit({event, item:this.activeItem});
  }

  onItemDblClick(event:any, item:any): void
  {
    this.activeItem = item;
    this.dblClickEmitter.emit({event, item:this.activeItem});
  }

  states()
  {
    return State;
  }

  getItemValue(item: any, key:string, cell:any)
  {
    if (typeof key === 'function')
      return this.getItemFunctionResult(item, cell);

    if (key.indexOf(".") == -1)
      return item[key];

    let firstItem = key.substring(0, key.indexOf("."));
    let path = key.substring(key.indexOf(".") + 1);
    return this.getItemValue(item[firstItem], path, cell);
  }

  getItemFunctionResult(item:any, cell:any)
  {
    if (cell.value)
      return cell.value(item, cell);

    return '';
  }

  public setActiveItem(item:any)
  {
    this.activeItem = item;
  }

  onSort(item:any)
  {
    for (let cell of this.schema)
      if (cell.name != item.name)
        cell.sort = null;
      else
        cell.sort = this.getNextSortMode(cell.sort);

    this.sortEmitter.emit(item);
  }

  private getNextSortMode(current:SortMode)
  {
    return current == null?0:current == 2?0:current + 1;
  }

  sortMode()
  {
    return SortMode;
  }

  isNum(item, cell)
  {
    return typeof this.getItemValue(item, cell.value, cell) === 'number';
  }

  getNumberValue(item, cell, divider)
  {
    let num = this.getItemValue(item, cell.value, cell);
    if (typeof num !== 'number')
      return "-";
    
    return cell.denomination?num / cell.denomination : num;
  }
}