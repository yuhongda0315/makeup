'use strict';
let tpl = `
package io.rong.message;

import android.os.Parcel;
import android.text.TextUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import io.rong.common.RLog;
import io.rong.imlib.MessageTag;
import io.rong.imlib.model.MentionedInfo;
import io.rong.imlib.model.MessageContent;
import io.rong.imlib.model.UserInfo;
import io.rong.common.ParcelUtils;

@MessageTag(value = "{{this.name}}", flag = {{this.flag}})
public class {{this.messageType}} extends MessageContent {
    private final static String TAG = "{{this.messageType}}";

    protected {{this.messageType}}() {

    }

    public {{this.messageType}}({{ var count = 0; for(var key in this.proto){ count++; }} {{this.verify[key].type }} {{key}} {{ if( count < this.count){}},{{ } }} {{ } }}) {
        {{ for(var key in this.proto){ }}

          this.set{{this.upperLetter(key)}}({{key}});

        {{ } }}
    }

    {{ for(var key in this.proto){  }}
      private {{this.verify[key].type}} {{key}};

      public void set{{this.upperLetter(key)}}({{this.verify[key].type}} {{key}}) {
          this.{{key}} = {{key}};
      }

      public {{this.verify[key].type}} get{{this.upperLetter(key)}}() {
          return {{key}};
      }
    {{ } }}
    
    @Override
    public byte[] encode() {

        JSONObject jsonObj = new JSONObject();
        try {
            {{ for(var key in this.proto){ }}
              jsonObj.put("{{key}}", get{{this.upperLetter(key)}}());
            {{ } }}
        } catch (JSONException e) {
            RLog.e(TAG, "JSONException " + e.getMessage());
        }

        try {
            return jsonObj.toString().getBytes("UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return null;
    }

    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
      {{ for(var key in this.proto){ }}
        ParcelUtils.writeToParcel(dest, get{{this.upperLetter(key)}}());
      {{ } }}  
    }

    public {{this.messageType}}(Parcel in) {
      {{ for(var key in this.proto){ }}
        set{{this.upperLetter(key)}}(ParcelUtils.readFromParcel(in));
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

}
`;

let ext = 'java';
module.exports = {
	tpl: tpl,
	ext: ext
};