import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

declare var google: any;

@Component({
  selector: "map-context-menu",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./map-context-menu.component.html"
})
export class MapContextMenuComponent implements OnInit {
  ngOnInit() {}

  public show() {}

  public hide() {}
}
