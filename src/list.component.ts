import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef, TemplateRef } from '@angular/core';
import { State, SortMode } from './list-utils'
import { SimpleChanges, OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Observable';
import { VirtualScrollComponent } from 'angular2-virtual-scroll';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnChanges
{
  @Input('items') items: any[] = [];
  @Input('schema') schema: any = {};
  @Input('highlight') highlight: Function = null;
  @Input('state') state: State = State.List;
  @Input('error') error: string;
  @Input('flow') flow :  boolean=false;
  @Input('header-on-empty') headerOnEmpty: boolean = false;
  @Input('max-height') maxHeight: string = "100%";
  @Input('min-width') minWidth: string = "200px";
  @Input('select-mode') isSelectMode: boolean = false;
  @Input('with-header') withHeader: boolean = true;
  @Input('context-items') contextItems: any[] = null;
  @Input('receive-keys') receiveKeys: boolean = true;
  @Input('focused') focused: boolean = true;

  @Output('item-click') clickEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output('item-dbl-click') dblClickEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output('items-checked') checkEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output('on-sort') sortEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output('on-filter') filterEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output('on-item-value-change') itemValueEmitter: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('contextMenu') contextMenuElem : ElementRef;
  @ViewChild('list') listElem : ElementRef;
  @ViewChild(VirtualScrollComponent)
  private virtualScroll: VirtualScrollComponent;

  private activeItem:any = null;
  activeHeight: string = this.maxHeight;
  viewPortItems:any[];
  checkSortMode:SortMode;
  menu:any = {active:false}


  private ke:any = {up:-1,down:1,enter:0, space:4};

  constructor(public elem: ElementRef) { }

  ngOnInit() 
  {
    this.elem.nativeElement.onclick = (event)=>{
      this.menu.active = false;
    };

    if (this.receiveKeys)
    {
      console.log("listening for keys")
      document.addEventListener('keydown', (event:KeyboardEvent) => 
      {
        console.trace("event, proceed:" + this.focused)
        if (!this.focused)
          return;

        if (event.keyCode == 38 || event.keyCode == 75)
          this.onKeyEvent(event, this.ke.up);
        if (event.keyCode == 40 || event.keyCode == 74)
          this.onKeyEvent(event, this.ke.down);
        if (event.keyCode == 13)
          this.onKeyEvent(event, this.ke.enter);
        if (event.keyCode == 32)
          this.onKeyEvent(event, this.ke.space);
     });
    }
  }

  itemClass(item:any): string
  {
    return item == this.activeItem? "active-list-item":"";
  }

  onItemClick(event:any, item:any): void
  {
    if (this.isSelectMode)
      this.onItemCheck(item);

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

  onKeyEvent(event:any, code:number)
  {
    if (code == this.ke.enter)
    {
      if (this.activeItem)
        this.onItemDblClick(event, this.activeItem);
      return;
    }
    else if (code == this.ke.space)
    {
      if (this.activeItem)
        this.onItemClick(event, this.activeItem);
      return;
    }

    if (this.activeItem)
    {
      let next = this.getIndexedItem(this.activeItem.__i + code);
      if (next)
      {
        this.activeItem = next;
        if (this.viewPortItems.indexOf(next) == -1)
          this.virtualScroll.scrollInto(this.activeItem);
      }
    }
    else
    {
      this.activeItem = this.items[0];
    }
  }

  private getIndexedItem(index:number):any
  {
    for (let i = 0; i < this.items.length; i++)
      if (this.items[i].__i == index)
        return this.items[i];

    return null;
  }

  ngOnChanges(changes: SimpleChanges)
  {
    if (!this.items || this.items.length == 0 && this.maxHeight)
      this.activeHeight = (parseInt(this.maxHeight.replace("px","")) - 16) + "px";
    else
      this.activeHeight = this.maxHeight;
    
    let x = 0;
    this.items = this.items.map(i => {i.__i = x++; return i;});

    if (changes.isSelectMode && changes.isSelectMode.currentValue === false)
      for (let item of this.items)
        delete item.__checked;
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

  onFilter(cell:any, button:any = null)
  {
    cell.isFiltering = !cell.isFiltering;
    if (cell.isFiltering && button)
    {
      let div = button.parentElement;
      setTimeout(()=>{
        div.firstElementChild.getElementsByClassName("filter-box")[0].focus();
      }, 50);
    }
    else if (!cell.isFiltering)
    {
      this.onFilterUpdate(null, cell);
    }
  }

  onFilterUpdate(term, cell)
  {
    this.filterEmitter.emit({term,cell});
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

  getClass(item, cell)
  {
    let itemCellClass = "";
    if (item.class)
    {
      let mapperCol = cell.valueClassId || cell.value;
      if (typeof mapperCol == "string")
        itemCellClass = item.class[mapperCol];
    }

    return (cell.class?cell.class:"") + " " + itemCellClass;
  }

  getNumberValue(item, cell, divider)
  {
    let num = this.getItemValue(item, cell.value, cell);
    if (typeof num !== 'number')
      return "-";
    
    return cell.denomination?num / cell.denomination : num;
  }

  onItemCheck(item)
  {
    item.__checked = !item.__checked;
    this.checkEmitter.emit(this.items.filter(item => item.__checked));
  }

  onSortBySelected()
  {
    this.checkSortMode = this.getNextSortMode(this.checkSortMode);

    this.items.sort((left, right) => {
      let lf = left.__checked == undefined?false:left.__checked;
      let rf = right.__checked == undefined?false:right.__checked;

      if (this.checkSortMode == SortMode.asc)
        return lf < rf?-1:1;
      if (this.checkSortMode == SortMode.desc)
        return lf > rf?-1:1;
      return 0;
    });
  }

  onItemValueChange(item, cell)
  {
    this.itemValueEmitter.emit({item, cell});
  }

  onRightClick(event, item)
  {
    this.setActiveItem(item);

    if (!this.contextItems || this.contextItems.length == 0)
      return true;
      
    if (this.menu.active && event.pageX === this.menu.x && event.pageY === this.menu.y)
      this.menu.active = false;
    else
      this.menu = {x:event.pageX, y:event.pageY, active:true};
    
    this.menu.listItem = item;

    setTimeout(()=>{
      let ctxH = this.contextMenuElem.nativeElement.clientHeight;
      let listH = this.listElem.nativeElement.clientHeight;
      if (this.menu.y + ctxH > listH)
        this.menu.y -= ctxH;

      let ctxW = this.contextMenuElem.nativeElement.clientWidth;
      let listW = this.listElem.nativeElement.clientWidth;
      if (this.menu.x + ctxW > listW)
          this.menu.x -= ctxW;
    }, 10);

    return false;
  }

  onContextAction(contextItem)
  {
    if (contextItem.action)
      contextItem.action(this.menu.listItem);
  }
}