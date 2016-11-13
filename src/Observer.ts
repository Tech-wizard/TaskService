interface Observer {
    onChange(task: Task): void;
}

class NPC extends egret.DisplayObjectContainer implements Observer {
    public _emoji: egret.Bitmap;
    public _body: egret.Bitmap;
    private id: string;

    constructor(id: string) {
        super();
        this.id = id;
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onNPCClick, this);
    }

    public set emoji(emoji: egret.Bitmap) {
        this._emoji = emoji;
    }

    public set body(body: egret.Bitmap) {
        this._body = body;
    }

    onChange(task: Task) {
        TaskService.getInstance().getTaskByCustomRule();
        if (task.status == TaskStatus.UNACCEPTABLE) {
            task.status = TaskStatus.ACCEPTABLE;
            this._emoji.texture = RES.getRes("notice");
        }
    }

    onNPCClick() {


    }
}

class TaskPanel implements Observer {

    body: egret.Shape;


    constructor() {
        this.body.graphics.beginFill(0x000000, 0.5);
        this.body.graphics.drawRect(0, 0, 300, 172);
        this.body.graphics.endFill();
        this.body.y = 33;

    }

    onChange(task: Task): void {


    }

}


class DialoguePanel extends egret.DisplayObjectContainer{

    button: Button;
    textField: egret.TextField;
    body: egret.Shape;
    constructor() {
        super();
        this.body.graphics.beginFill(0x000000, 0.5);
        this.body.graphics.drawRect(0, 0, 300, 172);
        this.body.graphics.endFill();
        this.body.y = 200;
        this.textField.text = "       ";
        this.button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
    }

    onButtonClick() {
    
    }
}

class Button extends egret.DisplayObjectContainer {

}