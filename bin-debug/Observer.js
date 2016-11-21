var NPC = (function (_super) {
    __extends(NPC, _super);
    // public task:Task;
    function NPC(id, ad, x, y, dp) {
        _super.call(this);
        this._body = new egret.Bitmap();
        this._emoji = new egret.Bitmap();
        this.dialoguePanel = dp;
        this._body.texture = RES.getRes(ad);
        this._emoji.texture = RES.getRes("notice_png");
        this.id = id;
        this.x = x;
        this.y = y;
        this._body.width = this._body.width / 3;
        this._body.height = this._body.height / 3;
        this._emoji.width = this._emoji.width / 5;
        this._emoji.height = this._emoji.height / 5;
        this._emoji.y = -100;
        this._emoji.alpha = 0;
        this.addChild(this._body);
        this.addChild(this._emoji);
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onNPCClick, this);
    }
    var d = __define,c=NPC,p=c.prototype;
    p.onChange = function (task) {
        if (task.status == TaskStatus.ACCEPTABLE && this.id == task.fromNpcId) {
            //task.status = TaskStatus.DURING;
            this._emoji.texture = RES.getRes("notice_png");
            this._emoji.alpha = 1;
        }
        if (task.status == TaskStatus.CAN_SUBMIT && this.id == task.fromNpcId) {
            //this._emoji.texture = RES.getRes("question_png");
            this._emoji.alpha = 0;
        }
        if (task.status == TaskStatus.CAN_SUBMIT && this.id == task.toNpcId) {
            this._emoji.texture = RES.getRes("question_png");
            this._emoji.alpha = 1;
        }
        if (task.status == TaskStatus.SUBMITED && this.id == task.toNpcId) {
            this._emoji.alpha = 0;
        }
    };
    p.onNPCClick = function () {
        this.dialoguePanel.showDpanel();
        //TaskService.getInstance().notify(TaskService.getInstance().taskList["000"]);
    };
    return NPC;
}(egret.DisplayObjectContainer));
egret.registerClass(NPC,'NPC',["Observer"]);
var TaskPanel = (function (_super) {
    __extends(TaskPanel, _super);
    //task:Task
    function TaskPanel(x, y) {
        _super.call(this);
        this.x = x;
        this.y = y;
        this.body = new egret.Shape();
        this.body.graphics.beginFill(0x000000, 0.4);
        this.body.graphics.drawRect(0, 0, 600, 100);
        this.body.graphics.endFill();
        this.textField = new egret.TextField();
        this.textField.text = "   任务进程    ";
        this.textField.x = x;
        this.textField.x = y;
        this.textField2 = new egret.TextField();
        this.textField2.text = "   任务状态    ";
        this.textField2.x = x + 20;
        this.textField2.y = y + 30;
        this.textField3 = new egret.TextField();
        this.textField2.text = "   进度    ";
        this.textField3.x = x + 20;
        this.textField3.y = y + 55;
        this.addChild(this.body);
        this.addChild(this.textField);
        this.addChild(this.textField2);
        this.addChild(this.textField3);
    }
    var d = __define,c=TaskPanel,p=c.prototype;
    p.onChange = function (task) {
        this.textField.text = task.desc;
        this.textField2.text = task.name + " :" + task.status.toString();
        this.textField3.text = task.name + " :" + task.getcurrent() + "/" + task.total;
    };
    return TaskPanel;
}(egret.DisplayObjectContainer));
egret.registerClass(TaskPanel,'TaskPanel',["Observer"]);
var DialoguePanel = (function (_super) {
    __extends(DialoguePanel, _super);
    function DialoguePanel(talk) {
        _super.call(this);
        this.body = new egret.Shape();
        this.body.graphics.beginFill(0x000000, 0.5);
        this.body.graphics.drawRect(0, 0, 600, 172);
        this.body.graphics.endFill();
        this.body.y = 450;
        this.textField = new egret.TextField();
        this.textField.text = talk;
        this.button = new Button("ok_png");
        this.textField.x = 80;
        this.textField.y = 500;
        this.button.width = 40;
        this.button.height = 40;
        this.button.x = 500;
        this.button.y = 550;
        this.button.touchEnabled = true;
        this.button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
    }
    var d = __define,c=DialoguePanel,p=c.prototype;
    p.showDpanel = function () {
        this.addChild(this.body);
        this.addChild(this.button);
        this.addChild(this.textField);
    };
    p.updateViewByTask = function (task) {
        this.currentTask = task;
        //this.textField.text = this.currentTask.desc;
    };
    p.disshowDpanel = function () {
        this.removeChild(this.body);
        this.removeChild(this.button);
        this.removeChild(this.textField);
    };
    p.onButtonClick = function () {
        this.disshowDpanel();
        switch (this.currentTask.status) {
            case TaskStatus.ACCEPTABLE:
                TaskService.getInstance().accept(this.currentTask.id);
                break;
            case TaskStatus.CAN_SUBMIT:
                //console.log(TaskService.getInstance().finish("000"));
                TaskService.getInstance().finish(this.currentTask.id);
                TaskService.getInstance().taskList["001"].status = TaskStatus.ACCEPTABLE;
                //this.linkNPC._emoji.alpha = 1;
                this.updateViewByTask(TaskService.getInstance().getTaskByCustomRule());
                TaskService.getInstance().notify(this.currentTask);
                break;
            default:
                break;
        }
    };
    return DialoguePanel;
}(egret.DisplayObjectContainer));
egret.registerClass(DialoguePanel,'DialoguePanel');
var Button = (function (_super) {
    __extends(Button, _super);
    function Button(ad) {
        _super.call(this);
        this.body = new egret.Bitmap();
        this.body.texture = RES.getRes(ad);
        this.addChild(this.body);
        this.touchEnabled = true;
    }
    var d = __define,c=Button,p=c.prototype;
    return Button;
}(egret.DisplayObjectContainer));
egret.registerClass(Button,'Button');
var MockKillMonsterButton = (function (_super) {
    __extends(MockKillMonsterButton, _super);
    function MockKillMonsterButton(ad) {
        var _this = this;
        _super.call(this, ad);
        this.count = 0;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonClick, this);
        egret.Ticker.getInstance().register(function () {
            if (_this.count < 5) {
                _this.body.scaleY *= 1.05;
            }
            else if (_this.count < 10 || _this.count >= 5) {
                _this.body.scaleY /= 1.05;
            }
            _this.count += 0.5;
            if (_this.count >= 10) {
                _this.count = 0;
            }
        }, this);
    }
    var d = __define,c=MockKillMonsterButton,p=c.prototype;
    p.onButtonClick = function () {
        console.log(TaskService.getInstance().taskList["001"].status);
        if (TaskService.getInstance().taskList["001"].status == TaskStatus.DURING) {
            console.log(TaskService.getInstance().taskList["001"].status);
            TaskService.getInstance().taskList["001"].condition.onChange(TaskService.getInstance().taskList["001"]);
        }
    };
    p.onChange = function () {
    };
    return MockKillMonsterButton;
}(Button));
egret.registerClass(MockKillMonsterButton,'MockKillMonsterButton',["Observer"]);
//# sourceMappingURL=Observer.js.map