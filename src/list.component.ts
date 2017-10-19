import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { State } from './list-utils'

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

  @Output('item-click') clickEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output('item-dbl-click') dblClickEmitter: EventEmitter<any> = new EventEmitter<any>();

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
}
