'use strict';
let tpl = `
package io.rong.message;

import android.os.Parcel;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;

import io.rong.common.ParcelUtils;
import io.rong.imlib.MessageTag;
import io.rong.imlib.model.MessageContent;

@MessageTag(value = "{{this.name}}", flag = {{this.flag}})
public class {{this.messageType}} extends MessageContent {
  public {{this.messageType}}() {
  }
  public {{this.messageType}}(byte[] data) {
    String jsonStr = null;
    try {
        jsonStr = new String(data, "UTF-8");
    } catch (UnsupportedEncodingException e) {
        e.printStackTrace();
    }
    try {
        JSONObject jsonObj = new JSONObject(jsonStr);
        {{ for(var key in this.proto){ }}
          if (jsonObj.has("{{key}}")){
            {{key}} = jsonObj.opt{{this.upperLetter(this.verify[key].type.val)}}("{{key}}");
          }
        {{ } }}
    } catch (JSONException e) {
        e.printStackTrace();
    }
  }
  @Override
  public byte[] encode() {
    JSONObject jsonObj = new JSONObject();
    try {
        {{ for(var key in this.proto){ }}
            jsonObj.put("{{key}}", {{key}});
        {{ } }}
    } catch (JSONException e) {
        e.printStackTrace();
    }
    try {
        return jsonObj.toString().getBytes("UTF-8");
    } catch (UnsupportedEncodingException e) {
        e.printStackTrace();
    }
    return null;
  }
  @Override
  public int describeContents() {
    return 0;
  }
  @Override
  public void writeToParcel(Parcel dest, int flags) {
    {{ for(var key in this.proto){ }}
      {{ if(this.verify[key].type.val == 'boolean'){ }}
        ParcelUtils.writeToParcel(dest, {{key}} ? 1 : 0);
      {{ }else{ }}
         ParcelUtils.writeToParcel(dest, {{key}});
      {{ } }}
    {{ } }}
  }
  protected DanMuMessage(Parcel in) {
    {{ for(var key in this.proto){ }}
      {{ if(this.verify[key].type.val == 'string'){ }}
        {{key}} = ParcelUtils.readFromParcel(in);
      {{ }else{ }}
        {{ if(this.verify[key].type.val == 'boolean'){ }}
          {{key}} = ParcelUtils.readIntFromParcel(in) != 0;
        {{ }else{ }}
          {{key}} = ParcelUtils.read{{this.upperLetter(this.verify[key].type.val)}}FromParcel(in);
        {{ } }}
      {{ } }}
    {{ } }}
  }
  public static final Creator<{{this.messageType}}> CREATOR = new Creator<{{this.messageType}}>() {
    @Override
    public {{this.messageType}} createFromParcel(Parcel source) {
        return new {{this.messageType}}(source);
    }
    @Override
    public {{this.messageType}}[] newArray(int size) {
        return new {{this.messageType}}[size];
    }
  };
  {{ for(var key in this.proto){ }}
    private {{var stiff = this.verify[key].type.stiff; var val = this.verify[key].type.val;if(stiff){}}{{val}}{{ } }}{{if(!stiff){ }}{{this.upperLetter(val)}}{{ } }} {{key}};
    public void set{{this.upperLetter(key)}}({{var stiff = this.verify[key].type.stiff; var val = this.verify[key].type.val;  if(stiff){ }} {{val}} {{ } }}  {{ if(!stiff){ }} {{ this.upperLetter(val) }} {{ } }} {{key}}) {
        {{key}} = {{key}};
    }
    public {{var stiff = this.verify[key].type.stiff; var val = this.verify[key].type.val;if(stiff){ }} {{val}}{{ } }}{{if(!stiff){ }}{{this.upperLetter(val)}}{{ } }} get{{this.upperLetter(key)}}() {
      return {{key}};
    }
  {{ } }}
}
`;

let Types = {
  string: {
    val: 'string'
  },
  double: {
    val: 'double',
    stiff: true
  },
  int: {
    val: 'int',
    stiff: true
  },
  boolean: {
    val: 'boolean',
    stiff: true
  }
};

let ext = 'java';
module.exports = {
	tpl: tpl,
	ext: ext,
  Types: Types
};