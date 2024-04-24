import { checkTelValid } from "../utils/fn/verify";


const single_time_max_cap = 60;
const max_len_of_name = 20;
const max_len_of_organize = 20;
const organize_type_list = [0, 1]
const submit_type_list = ['IMG', 'PDF']


export class Order {
    permission_name = "";
    permission_tel = "";
    organize = "";
    org_type = "";
    size_list = [];
    time_list = [];
    time_idx_list = [];
    need = "";
    sub_pm_type = "";
    url = "";
    constructor() {
        this.errors = [];
    }

    // 设置订单信息
    setPermissionName(permission_name) {
        this.permission_name = permission_name;
        return this;
    }

    setPermissionTel(permission_tel) {
        this.permission_tel = permission_tel;
        return this;
    }

    setOrganize(organize) {
        this.organize = organize;
        return this;
    }

    setOrgType(org_type) {
        this.org_type = org_type;
        return this;
    }

    setSizeList(size_list) {
        this.size_list = size_list;
        return this;
    }

    setTimeList(time_list) {
        this.time_list = time_list;
        return this;
    }

    setTimeIdxList(time_idx_list) {
        this.time_idx_list = time_idx_list;
        return this;
    }

    setNeed(need) {
        this.need = need;
        return this;
    }
    setSubPmType(sub_pm_type) {
        this.sub_pm_type = sub_pm_type;
        return this;
    }
    setUrl(url) {
        this.url = url;
        return this;
    }


    // 检测姓名是否合法
    checkPermissionName() {
        if (typeof this.permission_name !== 'string' || !(this.permission_name.length > 0 && this.permission_name.length <= max_len_of_name)) {
            this.errors.push('授权人姓名输入错误');
        }
        return this;
    }

    // 检测手机号是否合法
    checkPermissionTel() {
        if (!checkTelValid(this.permission_tel)) {
            this.errors.push('授权人手机号输入错误');
        }
        return this;
    }

    // 检测组织名是否合法
    checkOrganize() {
        if (typeof this.organize !== 'string' || this.organize.length <= 0 && this.organize.length > max_len_of_organize) {
            this.errors.push('组织名输入错误');
        }
        return this;
    }

    checkOrganizeType() {
        if (organize_type_list.indexOf(this.org_type) === -1) {
            this.errors.push('组织类型输入错误');
        }
        return this;
    }

    checkSize(size) {
        // 判断是否时正整数
        const is_digit = /^\d+$/.test(size);
        if (!is_digit) {
            return false;
        }
        return size >= 0 && size < single_time_max_cap;
    }

    checkSizeList() {
        if (this.size_list.length === 0) {
            this.errors.push('请选择参观人数');
        }
        for (let i = 0; i < this.size_list.length; i++) {
            if (!this.checkSize(this.size_list[i])) {
                this.errors.push(`场次${i + 1}人数输入错误`);
            }
        }
        const total_size = this.size_list.reduce((a, b) => parseInt(a) + parseInt(b), 0);

        if (total_size <
            ((this.size_list.length - 1) * single_time_max_cap + 1)) {

            this.errors.push('总人数过少，请合并参观场次');
        }
        return this;
    }

    checkTime(time) {
        // format: yyyy-mm-dd hh:mm
        const time_reg = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/;
        if (!time_reg.test(time)) {
            return false;
        }
        return true;
    }

    checkTimeList() {
        if (this.time_list.length === 0) {
            this.errors.push('请选择参观时间');
        }
        for (let i = 0; i < this.time_list.length; i++) {
            if (!this.checkTime(this.time_list[i])) {
                this.errors.push(`场次${i + 1}时间输入错误`);
            }
        }
        return this;
    }

    checkTimeIdxList() {
        if (this.time_idx_list.length === 0) {
            this.errors.push('请选择参观时间');
        }
        return this;
    }

    checkNeed() {
        if (typeof this.need !== 'boolean') {
            this.errors.push('请选择是否需要讲解员');
        }
        return this;
    }

    checkSubPmType() {
        if (submit_type_list.indexOf(this.sub_pm_type) === -1) {
            this.errors.push('请选择授权书类型');
        }
        return this;
    }

    checkUrl() {
        // 判断是否是url
        const url_reg = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/;
        if (!url_reg.test(this.url)) {
            this.errors.push('授权书url输入错误');
        }
        return this;
    }

    checkValid() {
        this.checkPermissionName()
            .checkPermissionTel()
            .checkOrganize()
            .checkOrganizeType()
            .checkSizeList()
            .checkTimeList()
            .checkTimeIdxList()
            .checkNeed()
            .checkSubPmType()
            .checkUrl();
        return this.errors.length === 0;
    }
}